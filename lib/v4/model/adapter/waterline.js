"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waterline = void 0;
const AbstractModel_1 = require("../AbstractModel");
class Waterline extends AbstractModel_1.AbstractModel {
    constructor(modelname, model) {
        super(modelname, model.attributes, model.primaryKey, model.identity);
        if (!model) {
            throw new Error('Model instance must be provided.');
        }
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data).fetch();
    }
    async findOne(id) {
        return await this.model.findOne({ id })
            /** TODO: resolve populate all */
            .populateAll();
    }
    async find(criteria = {}) {
        return await this.model.find(criteria)
            /** TODO: resolve populate all */
            .populateAll();
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
        return deletedRecords;
    }
    async count(criteria = {}) {
        return await this.model.count(criteria);
    }
}
exports.Waterline = Waterline;
