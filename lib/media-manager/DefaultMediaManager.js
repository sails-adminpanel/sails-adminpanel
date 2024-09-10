"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const Items_1 = require("./Items");
class DefaultMediaManager extends AbstractMediaManager_1.AbstractMediaManager {
    constructor(id, path, dir) {
        super(id, path, dir);
        this.itemTypes = [];
        this.model = "mediamanagerap";
        this.modelAssoc = "mediamanagerassociationsap";
        this.itemTypes.push(new Items_1.ImageItem(path, dir));
        this.itemTypes.push(new Items_1.TextItem(path, dir));
        this.itemTypes.push(new Items_1.ApplicationItem(path, dir));
        this.itemTypes.push(new Items_1.VideoItem(path, dir));
    }
    async getAll(limit, skip, sort) {
        let data = await sails.models[this.model]
            .find({
            where: { parent: null },
            limit: limit,
            skip: skip,
            sort: sort, //@ts-ignore
        })
            .populate("children", { sort: sort });
        let next = (await sails.models[this.model].find({
            where: { parent: null },
            limit: limit,
            skip: skip === 0 ? limit : skip + limit,
            sort: sort,
        })).length;
        return {
            data: data,
            next: !!next,
        };
    }
    async searchAll(s) {
        return await sails.models[this.model]
            .find({
            where: { filename: { contains: s }, parent: null },
            sort: "createdAt DESC",
        })
            .populate("children", { sort: "createdAt DESC" });
    }
    async saveRelations(data, model, modelId, widgetName) {
        let modelAssociations = await sails.models[this.modelAssoc].find({
            where: { modelId: modelId, model: model, widgetName: widgetName },
        });
        for (const modelAssociation of modelAssociations) {
            await sails.models[this.modelAssoc]
                .destroy(modelAssociation.id)
                .fetch();
        }
        for (const [key, widgetItem] of data.list.entries()) {
            await sails.models[this.modelAssoc].create({
                mediaManagerId: this.id,
                model: model,
                modelId: modelId,
                file: widgetItem.id,
                widgetName: widgetName,
                sortOrder: key + 1,
            });
        }
    }
    async getRelations(items) {
        let widgetItems = [];
        for (const item of items) {
            let file = (await sails.models[this.model]
                .find({ where: { id: item.id } })
                .populate("children", { sort: "createdAt DESC" }))[0];
            widgetItems.push({
                id: file.id,
                mimeType: file.mimeType,
                url: file.url,
                children: file.children,
            });
        }
        return widgetItems;
    }
    async updateRelations(data, model, modelId, modelAttribute) {
        await this.deleteRelations(model, modelId);
        await this.saveRelations(data, model, modelId, modelAttribute);
    }
    async deleteRelations(model, modelId) {
        let modelAssociations = await sails.models[this.modelAssoc].find({
            where: { modelId: modelId, model: model },
        });
        for (const modelAssociation of modelAssociations) {
            await sails.models[this.modelAssoc]
                .destroy(modelAssociation.id)
                .fetch();
        }
    }
}
exports.DefaultMediaManager = DefaultMediaManager;
