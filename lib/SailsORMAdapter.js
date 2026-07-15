import {AbstractAdapter, AbstractModel} from "adminizer";

/**
 * Converts Waterline attributes to Adminizer format
 */
function mapWaterlineToAdminizerAttributes(model) {
	const result = {};
	const attributes = model.attributes || {};

	for (const [name, attr] of Object.entries(attributes)) {
		const adminizerAttr = {
			type: resolveType(attr.type),
			required: attr.required || false,
			unique: attr.unique || false,
			defaultsTo: attr.defaultsTo,
			columnName: attr.columnName || attr.field || name,
		};

		// Handle associations
		if (attr.model) {
			adminizerAttr.type = 'association';
			adminizerAttr.model = attr.model;
		} else if (attr.collection) {
			adminizerAttr.type = 'association-many';
			adminizerAttr.collection = attr.collection;
			if (attr.via) {
				adminizerAttr.via = attr.via;
			}
		}

		result[name] = adminizerAttr;
	}

	// Add associations from meta if they exist
	if (model.associations) {
		for (const assoc of model.associations) {
			if (!result[assoc.alias]) {
				if (assoc.type === 'model') {
					result[assoc.alias] = {
						type: 'association',
						model: assoc.model || assoc.collection,
					};
				} else if (assoc.type === 'collection') {
					result[assoc.alias] = {
						type: 'association-many',
						collection: assoc.collection,
						via: assoc.via,
					};
				}
			}
		}
	}

	return result;
}

/**
 * Determines attribute type based on Waterline type
 */
function resolveType(type) {
	if (!type) return 'string';

	const typeStr = typeof type === 'string' ? type.toLowerCase() : String(type).toLowerCase();

	if (typeStr.includes('string') || typeStr.includes('text') || typeStr.includes('json') || typeStr.includes('ref')) {
		if (typeStr.includes('json')) return 'json';
		if (typeStr.includes('ref')) return 'ref';
		return 'string';
	}
	if (typeStr.includes('boolean')) return 'boolean';
	if (typeStr.includes('number') || typeStr.includes('integer') || typeStr.includes('float')) return 'number';
	if (typeStr.includes('datetime') || typeStr.includes('date')) return 'string';

	return 'string';
}

export class WaterlineModel extends AbstractModel {
	/** @type {Object} The actual Waterline model (collection) */
	model;

	/**
	 * @param {string} modelName - The model name in Adminizer
	 * @param {Object} model - The actual Waterline model from sails.models
	 */
	constructor(modelName, model) {
		if (!model) {
			throw new Error(`Model instance must be provided for ${modelName}`);
		}

		// Check that this is a valid Waterline model with methods
		if (typeof model.findOne !== 'function') {
			console.error(`Model ${modelName} is not a valid Waterline model:`, Object.keys(model).slice(0, 20));
			throw new Error(`Invalid Waterline model for ${modelName}: missing findOne method`);
		}

		// Extract primary key
		let primaryKey = 'id';
		if (model.primaryKey) {
			primaryKey = model.primaryKey;
		} else {
			// Look for primary key in attributes
			const attrs = model.attributes || {};
			for (const [name, attr] of Object.entries(attrs)) {
				if (attr.primaryKey) {
					primaryKey = name;
					break;
				}
			}
		}

		const attributes = mapWaterlineToAdminizerAttributes(model);

		super(modelName, attributes, primaryKey, model.identity || modelName);

		// Save direct reference to model
		this.model = model;
	}

	/**
	 * Converts Adminizer criteria to Waterline format
	 */
	_convertCriteriaToWaterline(criteria = {}) {
		const result = {};

		for (const [key, value] of Object.entries(criteria)) {
			if (key === 'sort' || key === 'populate' || key === 'select' || key === 'skip' || key === 'limit') {
				continue;
			}

			if (value === undefined) {
				continue;
			}

			if (value === null) {
				result[key] = null;
				continue;
			}

			if (Array.isArray(value)) {
				result[key] = { in: value };
				continue;
			}

			if (typeof value === 'object' && value !== null) {
				const hasOperators = Object.keys(value).some(op =>
					['>', '>=', '<', '<=', '!=', 'ne', 'like', 'contains', 'startsWith', 'endsWith', 'in', 'nin', 'notIn'].includes(op)
				);

				if (hasOperators) {
					const waterlineOps = {};
					for (const [op, val] of Object.entries(value)) {
						switch (op) {
							case '>': waterlineOps['>'] = val; break;
							case '>=': waterlineOps['>='] = val; break;
							case '<': waterlineOps['<'] = val; break;
							case '<=': waterlineOps['<='] = val; break;
							case '!=': case 'ne': waterlineOps['!='] = val; break;
							case 'like': waterlineOps['like'] = val; break;
							case 'contains': waterlineOps['contains'] = val; break;
							case 'startsWith': waterlineOps['startsWith'] = val; break;
							case 'endsWith': waterlineOps['endsWith'] = val; break;
							case 'in': waterlineOps['in'] = val; break;
							case 'nin': case 'notIn': waterlineOps['nin'] = val; break;
							default: waterlineOps[op] = val;
						}
					}
					result[key] = waterlineOps;
				} else {
					result[key] = value;
				}
			} else {
				result[key] = value;
			}
		}

		return result;
	}

	/**
	 * Converts Adminizer criteria to Waterline options
	 */
	_convertAdminizerCriteriaToWaterlineOptions(criteria = {}) {
		const { sort, select, populate, skip, limit, where, ...rest } = criteria;

		const criteriaObj = where || rest;

		const waterlineWhere = this._convertCriteriaToWaterline(criteriaObj);

		const waterlineCriteria = {};

		if (Object.keys(waterlineWhere).length > 0) {
			waterlineCriteria.where = waterlineWhere;
		}

		if (typeof skip === 'number') {
			waterlineCriteria.skip = skip;
		}

		if (typeof limit === 'number') {
			waterlineCriteria.limit = limit;
		}

		if (typeof sort === 'string') {
			waterlineCriteria.sort = sort;
		} else if (sort && typeof sort === 'object') {
			waterlineCriteria.sort = Object.entries(sort).map(([field, dir]) =>
				`${field} ${String(dir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`
			).join(' ');
		}

		if (select && Array.isArray(select)) {
			waterlineCriteria.select = select;
		}

		return { waterlineCriteria, populate };
	}

	/**
	 * Applies populate to the query
	 */
	async _applyPopulate(query, populate) {
		if (populate && typeof populate === 'object') {
			for (const [field, sub] of Object.entries(populate)) {
				if (sub === true) {
					query = query.populate(field);
				} else if (sub && typeof sub === 'object') {
					query = query.populate(field, sub);
				}
			}
		} else {
				// Automatically populate all associations
				const attrs = this.model.attributes || {};
				for (const [name, attr] of Object.entries(attrs)) {
				if (attr.model || attr.collection) {
					query = query.populate(name);
				}
			}
		}
		return query;
	}

	async _create(data) {
		try {
			const record = await this.model.create(data).fetch();
			return record;
		} catch (err) {
			console.error(`Error creating record in ${this.model.identity}:`, err);
			throw err;
		}
	}

	async _findOne(criteria = {}) {

		const { waterlineCriteria, populate } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);

		let query = this.model.findOne(waterlineCriteria);
		query = await this._applyPopulate(query, populate);
		const result = await query;
		return result || null;
	}

	async _find(criteria = {}) {
		const { waterlineCriteria, populate } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		let query = this.model.find(waterlineCriteria);
		query = await this._applyPopulate(query, populate);
		const results = await query;
		return results || [];
	}

	async _updateOne(criteria, data) {
		const { waterlineCriteria } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		try {
			const record = await this.model.updateOne(waterlineCriteria).set(data);
			return record;
		} catch (err) {
			console.error(`Error updating record in ${this.model.identity}:`, err);
			throw err;
		}
	}

	async _update(criteria, data) {
		const { waterlineCriteria } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		try {
			const records = await this.model.update(waterlineCriteria).set(data).fetch();
			return records || [];
		} catch (err) {
			console.error(`Error updating records in ${this.model.identity}:`, err);
			throw err;
		}
	}

	async _destroyOne(criteria) {
		const { waterlineCriteria } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		try {
			const record = await this.model.destroyOne(waterlineCriteria);
			return record;
		} catch (err) {
			console.error(`Error destroying record in ${this.model.identity}:`, err);
			throw err;
		}
	}

	async _destroy(criteria) {
		const { waterlineCriteria } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		try {
			const records = await this.model.destroy(waterlineCriteria).fetch();
			return records || [];
		} catch (err) {
			console.error(`Error destroying records in ${this.model.identity}:`, err);
			throw err;
		}
	}

	async _count(criteria = {}) {
		const { waterlineCriteria } = this._convertAdminizerCriteriaToWaterlineOptions(criteria);
		try {
			const count = await this.model.count(waterlineCriteria);
			return count;
		} catch (err) {
			console.error(`Error counting records in ${this.model.identity}:`, err);
			throw err;
		}
	}
}

export class SailsORMAdapter extends AbstractAdapter {
	Model = WaterlineModel;

	constructor(orm, options = {}) {
		super("sails", orm, options);
	}

	get models() {
		return this.orm;
	}

	/**
	 * Gets model by name
	 * Searches for the actual Waterline model in sails.models or the passed orm
	 */
	getModel(modelName) {
		// First search in this.orm (this could be sails.models)
		let model = this.orm[modelName.toLowerCase()];

		// If not found, try to find in global.sails.models
		if (!model && global.sails && global.sails.models) {
			model = global.sails.models[modelName.toLowerCase()];
		}

		// If found, but this is not a Waterline model with methods,
		// look for the actual model in global.sails.models
		if (model && typeof model.findOne !== 'function') {
			if (global.sails && global.sails.models) {
				// Look by attributes (if object is the same)
				for (const [name, m] of Object.entries(global.sails.models)) {
					if (m === model || m.attributes === model.attributes) {
						if (typeof m.findOne === 'function') {
							return m;
						}
					}
				}

				// Look by name (ignoring suffixes)
				const baseName = modelName.toLowerCase().replace(/ap$/i, '');
				for (const [name, m] of Object.entries(global.sails.models)) {
					if (typeof m.findOne === 'function') {
						const mBaseName = name.toLowerCase().replace(/ap$/i, '');
						if (mBaseName === baseName) {
							return m;
						}
					}
				}
			}
		}

		if (model && typeof model.findOne !== 'function') {
			console.warn(`Model ${modelName} found but missing Waterline methods`);
			return undefined;
		}

		return model;
	}

	getAttributes(modelName) {
		const model = this.getModel(modelName);
		if (!model) {
			throw new Error(`Model "${modelName}" was not found`);
		}
		return model.attributes;
	}
}
