"use strict";
class Waterline extends AbstractModel {
    constructor(modelname, model) {
        super(modelname);
        if (!model) {
            throw new Error('Model instance must be provided.');
        }
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data).fetch();
    }
    async findOne(id) {
        return await this.model.findOne({ id });
    }
    async find(criteria = {}) {
        return await this.model.find(criteria);
    }
    async updateOne(id, data) {
        return await this.model.updateOne({ id }).set(data);
    }
    async update(criteria, data) {
        return await this.model.update(criteria).set(data).fetch();
    }
    async destroyOne(id) {
        return await this.model.destroyOne({ id });
    }
    async destroy(criteria) {
        const deletedRecords = await this.model.destroy(criteria).fetch();
        return deletedRecords.length > 0;
    }
    async count(criteria = {}) {
        return await this.model.count(criteria);
    }
}
