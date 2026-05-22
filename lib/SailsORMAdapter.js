import {AbstractAdapter, AbstractModel} from "adminizer";

const LOGIC_KEYS = new Set(["and", "or", "not"]);

const OPERATOR_MAP = {
	eq: "==",
	ne: "!=",
	gt: ">",
	gte: ">=",
	lt: "<",
	lte: "<=",
	contains: "contains",
	startsWith: "startsWith",
	endsWith: "endsWith",
	like: "like",
	in: "in",
	notIn: "nin",
	nin: "nin"
};

function isPlainObject(value) {
	return value !== null
		&& typeof value === "object"
		&& !Array.isArray(value)
		&& !(value instanceof Date);
}

function isRelationPathKey(key) {
	return typeof key === "string" && /^\$[A-Za-z0-9_]+\.[A-Za-z0-9_]+\$$/.test(key);
}

export class WaterlineModel extends AbstractModel {
	model;

	constructor(modelName, model) {
		if (!model) {
			throw new Error("Model instance must be provided.");
		}
		super(modelName, model.attributes, model.primaryKey, model.identity);
		this.model = model;
	}

	/** Build list of relation attribute names defined on the Waterline model. */
	_relationNames() {
		const attrs = this.model.attributes || {};
		return Object.keys(attrs).filter((name) => attrs[name].model || attrs[name].collection);
	}

	/** Translate adapter-neutral QueryCriteria into Waterline-friendly criteria. */
	_normalizeCriteria(criteria = {}) {
		const {where, sort, limit, skip, select, populate, ...rest} = criteria || {};

		const rawWhere = where !== undefined ? where : rest;
		const convertedWhere = this._convertWhere(rawWhere);

		const result = {};
		if (convertedWhere && Object.keys(convertedWhere).length > 0) {
			result.where = convertedWhere;
		}
		if (sort !== undefined) {
			result.sort = this._convertSort(sort);
		}
		if (typeof limit === "number") {
			result.limit = limit;
		}
		if (typeof skip === "number") {
			result.skip = skip;
		}
		if (Array.isArray(select) && select.length > 0) {
			result.select = select.filter((field) => typeof field === "string");
		}

		// Hack: dropping sort by association field (Waterline can't ORDER BY a joined column)
		if (result.sort && (!result.where || Object.keys(result.where).length === 0)) {
			const sortField = this._extractSortField(result.sort);
			if (sortField && this._relationNames().includes(sortField)) {
				delete result.sort;
			}
		}

		return result;
	}

	_extractSortField(sort) {
		if (typeof sort === "string") {
			return sort.trim().split(/\s+/)[0];
		}
		if (Array.isArray(sort) && sort.length > 0) {
			const first = sort[0];
			if (typeof first === "string") return first.trim().split(/\s+/)[0];
			if (isPlainObject(first)) return Object.keys(first)[0];
		}
		if (isPlainObject(sort)) {
			return Object.keys(sort)[0];
		}
		return undefined;
	}

	_convertSort(sort) {
		if (typeof sort === "string") return sort;
		if (Array.isArray(sort)) return sort;
		if (isPlainObject(sort)) {
			const entries = Object.entries(sort);
			if (entries.length === 1) {
				const [field, dir] = entries[0];
				return `${field} ${String(dir).toUpperCase() === "DESC" ? "DESC" : "ASC"}`;
			}
			return entries.map(([field, dir]) => ({[field]: String(dir).toUpperCase() === "DESC" ? "DESC" : "ASC"}));
		}
		return sort;
	}

	/** Recursively convert adapter-neutral WHERE clause into Waterline format. */
	_convertWhere(where) {
		if (!where || typeof where !== "object") return {};

		const result = {};

		for (const [key, value] of Object.entries(where)) {
			if (value === undefined) continue;

			// Waterline cannot filter by joined relation columns — drop these conditions
			if (isRelationPathKey(key)) continue;

			if (key === "and") {
				const items = Array.isArray(value) ? value : [];
				const converted = items
					.map((item) => this._convertWhere(item))
					.filter((item) => item && Object.keys(item).length > 0);
				if (converted.length === 0) continue;
				if (converted.length === 1) {
					Object.assign(result, converted[0]);
				} else {
					result.and = converted;
				}
				continue;
			}

			if (key === "or") {
				const items = Array.isArray(value) ? value : [];
				const converted = items
					.map((item) => this._convertWhere(item))
					.filter((item) => item && Object.keys(item).length > 0);
				if (converted.length === 0) continue;
				if (converted.length === 1) {
					Object.assign(result, converted[0]);
				} else {
					result.or = converted;
				}
				continue;
			}

			if (key === "not") {
				const inverted = this._invertWhere(value);
				if (inverted && Object.keys(inverted).length > 0) {
					Object.assign(result, inverted);
				}
				continue;
			}

			const fieldCriterion = this._convertFieldValue(value);
			if (fieldCriterion !== undefined) {
				result[key] = fieldCriterion;
			}
		}

		return result;
	}

	/** Convert a single field value (primitive, array, or operator object) to Waterline format. */
	_convertFieldValue(value) {
		if (value === null) return null;
		if (Array.isArray(value)) return {in: value};
		if (value instanceof Date) return value;
		if (!isPlainObject(value)) return value;

		// Object — treat keys as operator descriptors
		const out = {};
		for (const [op, raw] of Object.entries(value)) {
			if (raw === undefined) continue;

			switch (op) {
				case "between": {
					if (Array.isArray(raw) && raw.length === 2) {
						out[">="] = raw[0];
						out["<="] = raw[1];
					}
					break;
				}
				case "isNull": {
					if (raw) return null;
					break;
				}
				case "isNotNull": {
					if (raw) out["!="] = null;
					break;
				}
				case "jsonContains": {
					// Waterline has no native JSON containment; approximate with LIKE on serialized value.
					const items = Array.isArray(raw) ? raw : [raw];
					const patterns = items.map((item) => `%${JSON.stringify(item).replace(/[%_]/g, "\\$&")}%`);
					if (patterns.length === 1) {
						out.contains = patterns[0].slice(1, -1);
					}
					break;
				}
				case "regex": {
					// Waterline has no regex operator — silently skip.
					break;
				}
				case "eq":
				case "==":
				case "$eq": {
					return raw;
				}
				default: {
					const mapped = OPERATOR_MAP[op];
					if (mapped) {
						out[mapped] = raw;
					}
				}
			}
		}

		if (Object.keys(out).length === 0) return undefined;
		return out;
	}

	/** Best-effort inversion of a WHERE fragment for `not` semantics. */
	_invertWhere(where) {
		if (!isPlainObject(where)) return {};

		const converted = this._convertWhere(where);
		const keys = Object.keys(converted);
		if (keys.length === 0) return {};

		// Only invert single-field clauses; bail otherwise (Waterline lacks general NOT support).
		if (keys.length !== 1) return {};

		const [field] = keys;
		const value = converted[field];

		if (field === "or" || field === "and") {
			return {};
		}

		if (value === null) {
			return {[field]: {"!=": null}};
		}
		if (Array.isArray(value)) {
			return {[field]: {nin: value}};
		}
		if (isPlainObject(value)) {
			const inverted = {};
			for (const [op, raw] of Object.entries(value)) {
				switch (op) {
					case "==": inverted["!="] = raw; break;
					case "!=": inverted["=="] = raw; break;
					case ">": inverted["<="] = raw; break;
					case ">=": inverted["<"] = raw; break;
					case "<": inverted[">="] = raw; break;
					case "<=": inverted[">"] = raw; break;
					case "in": inverted.nin = raw; break;
					case "nin": inverted.in = raw; break;
					default: return {};
				}
			}
			return {[field]: inverted};
		}

		return {[field]: {"!=": value}};
	}

	/** Apply populate option per CriteriaPopulate (Record<string, true | QueryCriteria>) or default to populate all. */
	_applyPopulate(query, populate) {
		if (populate && typeof populate === "object") {
			for (const [field, nested] of Object.entries(populate)) {
				if (!this.model.attributes[field]) continue;
				if (nested === true || nested === undefined) {
					query = query.populate(field);
				} else {
					const nestedCriteria = this._normalizeCriteria(nested);
					query = query.populate(field, nestedCriteria);
				}
			}
			return query;
		}

		for (const name of this._relationNames()) {
			query = query.populate(name);
		}
		return query;
	}

	async _create(data) {
		return await this.model.create(data).fetch();
	}

	async _findOne(criteria = {}) {
		const normalized = this._normalizeCriteria(criteria);
		let query = this.model.findOne(normalized);
		query = this._applyPopulate(query, criteria.populate);
		return await query;
	}

	async _find(criteria = {}) {
		const normalized = this._normalizeCriteria(criteria);
		let query = this.model.find(normalized);
		query = this._applyPopulate(query, criteria.populate);
		return await query;
	}

	async _updateOne(criteria, data) {
		const normalized = this._normalizeCriteria(criteria);
		return await this.model.updateOne(normalized.where || {}).set(data);
	}

	async _update(criteria, data) {
		const normalized = this._normalizeCriteria(criteria);
		return await this.model.update(normalized.where || {}).set(data).fetch();
	}

	async _destroyOne(criteria) {
		const normalized = this._normalizeCriteria(criteria);
		return await this.model.destroyOne(normalized.where || {});
	}

	async _destroy(criteria) {
		const normalized = this._normalizeCriteria(criteria);
		return await this.model.destroy(normalized.where || {}).fetch();
	}

	async _count(criteria = {}) {
		const normalized = this._normalizeCriteria(criteria);
		return await this.model.count(normalized.where || {});
	}
}

export class SailsORMAdapter extends AbstractAdapter {
	Model = WaterlineModel;

	constructor(orm) {
		super("sails", orm);
	}

	get models() {
		return this.orm;
	}

	getModel(modelName) {
		return this.orm[modelName];
	}

	getAttributes(modelName) {
		const model = this.getModel(modelName);
		if (!model) {
			throw new Error(`Model "${modelName}" was not found`);
		}
		return model.attributes;
	}
}
