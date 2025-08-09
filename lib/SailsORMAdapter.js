import {AbstractAdapter, AbstractModel} from "adminizer";

export class WaterlineModel extends AbstractModel {
	model;

	constructor(modelName, model) {
		super(modelName, model.attributes, model.primaryKey, model.identity);
		if (!model) {
			throw new Error('Model instance must be provided.');
		}
		this.model = model;
	}

	async _create(data) {
		return await this.model.create(data).fetch();
	}

	/** Custom populate all function */
	async populateAll(query, model) {
		// Get 'model' and 'collection' fields
		const associations = Object.keys(model.attributes)
			.filter(attr => model.attributes[attr].model || model.attributes[attr].collection);
		// Dynamically populate all associations
		associations.forEach(attr => {
			query = query.populate(attr);
		});
		return query;
	}

	async _findOne(criteria) {
		let query = this.model.findOne(criteria);
		query = await this.populateAll(query, this.model);
		return await query;
	}

	async _find(criteria = {}, options = {}) {
		let query = this.model.find(criteria);
		if (options.populate && Array.isArray(options.populate) && options.populate.length > 0) {
			options.populate.forEach(([field, populateCriteria]) => {
				if (typeof field === "string") {
					query = query.populate(field, populateCriteria || {});
				}
			});
		} else {
			query = await this.populateAll(query, this.model);
		}
		if (options.limit && typeof options.limit === "number") {
			query = query.limit(options.limit);
		}
		let result = await query;
		return result;
	}

	async _updateOne(criteria, data) {
		return await this.model.updateOne(criteria).set(data);
	}

	async _update(criteria, data) {
		return await this.model.update(criteria).set(data).fetch();
	}

	async _destroyOne(criteria) {
		return await this.model.destroyOne(criteria);
	}

	async _destroy(criteria) {
		return await this.model.destroy(criteria).fetch();
	}

	async _count(criteria = {}) {
		return await this.model.count(criteria);
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
