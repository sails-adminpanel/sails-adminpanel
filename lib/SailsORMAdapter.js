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

	/**
	 * Splits an adminizer QueryCriteria into the plain Waterline criteria
	 * ({ where, limit, skip, sort, select }) and the `populate` map.
	 * Waterline's find()/findOne() reject `populate` inside the criteria object,
	 * it must be applied via the .populate() query method instead.
	 */
	splitCriteria(criteria = {}) {
		const { populate, ...waterlineCriteria } = criteria || {};
		return { waterlineCriteria, populate };
	}

	applyPopulate(query, populate) {
		if (populate && typeof populate === "object") {
			Object.keys(populate).forEach(field => {
				const sub = populate[field];
				if (sub === true) {
					query = query.populate(field);
				} else if (sub && typeof sub === "object") {
					query = query.populate(field, sub);
				}
			});
			return query;
		}
		return this.populateAll(query, this.model);
	}

	async _findOne(criteria = {}) {
		const { waterlineCriteria, populate } = this.splitCriteria(criteria);
		let query = this.model.findOne(waterlineCriteria);
		query = await this.applyPopulate(query, populate);
		return await query;
	}

	async _find(criteria = {}) {
		const { waterlineCriteria, populate } = this.splitCriteria(criteria);

        // Hack
        const attributes = this.model.attributes;
        const associations = Object.keys(attributes).filter(
            attr => attributes[attr].model || attributes[attr].collection
        );


        if (JSON.stringify(waterlineCriteria.where) === '{}') {
            let sortField;

            if (waterlineCriteria?.sort) {
                if (typeof waterlineCriteria.sort === 'string') {
                    sortField = waterlineCriteria.sort.split(' ')[0];
                } else if (Array.isArray(waterlineCriteria.sort)) {
                    sortField = waterlineCriteria.sort[0];
                }
            }

            if (sortField && associations.includes(sortField)) {
                waterlineCriteria.sort = undefined;
            }
        }

		let query = this.model.find(waterlineCriteria);
		query = await this.applyPopulate(query, populate);
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
