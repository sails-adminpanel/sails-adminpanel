"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const Items_1 = require("./Items");
class DefaultMediaManager extends AbstractMediaManager_1.AbstractMediaManager {
    constructor(id, path, dir, model, metaModel) {
        super(id, path, dir, model);
        this.itemTypes = [];
        this.itemTypes.push(new Items_1.ImageItem(path, dir, model, metaModel));
        this.itemTypes.push(new Items_1.TextItem(path, dir, model, metaModel));
        this.itemTypes.push(new Items_1.ApplicationItem(path, dir, model, metaModel));
    }
    async getAll(limit, skip, sort) {
        let data = await sails.models[this.model].find({
            where: { parent: null },
            limit: limit,
            skip: skip,
            sort: sort //@ts-ignore
        }).populate('children', { sort: sort });
        let next = (await sails.models[this.model].find({
            where: { parent: null },
            limit: limit,
            skip: skip === 0 ? limit : skip + limit,
            sort: sort
        })).length;
        return {
            data: data,
            next: !!next
        };
    }
}
exports.DefaultMediaManager = DefaultMediaManager;
