"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
class AbstractModel {
    constructor(modelname, attributes, primaryKey, identity) {
        this.modelname = modelname;
        this.attributes = attributes;
        this.primaryKey = primaryKey;
        this.identity = identity;
    }
    async _create(data, dataAccessor) {
        let _data = dataAccessor.process(data);
        let record = await this.create(_data);
        return dataAccessor.process(record);
    }
    async _findOne(id, dataAccessor) {
        let record = await this.findOne(id);
        return record ? dataAccessor.process(record) : null;
    }
    async _find(criteria, dataAccessor) {
        criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
        let records = await this.find(criteria);
        return records.map(record => dataAccessor.process(record));
    }
    async _updateOne(id, data, dataAccessor) {
        let _data = dataAccessor.process(data);
        let record = await this.updateOne(id, _data);
        return record ? dataAccessor.process(record) : null;
    }
    async _update(criteria, data, dataAccessor) {
        let _data = dataAccessor.process(data);
        let records = await this.update(criteria, _data);
        return records.map(record => dataAccessor.process(record));
    }
    async _destroyOne(id, dataAccessor) {
        let record = await this.destroyOne(id);
        return record ? dataAccessor.process(record) : null;
    }
    async _destroy(criteria, dataAccessor) {
        let records = await this.destroy(criteria);
        return records.map(record => dataAccessor.process(record));
    }
    async _count(criteria) {
        return this.count(criteria);
    }
}
exports.AbstractModel = AbstractModel;
