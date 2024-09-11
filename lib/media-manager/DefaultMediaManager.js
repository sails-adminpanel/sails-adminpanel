"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const MediaManagerHelper_1 = require("./helpers/MediaManagerHelper");
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
    async getAll(limit, skip, sort, group) {
        let data = await sails.models[this.model]
            .find({
            where: { parent: null, group: group },
            limit: limit,
            skip: skip,
            sort: sort, //@ts-ignore
        })
            .populate("variants", { sort: sort }).populate('meta');
        let next = (await sails.models[this.model].find({
            where: { parent: null, group: group },
            limit: limit,
            skip: skip === 0 ? limit : skip + limit,
            sort: sort,
        })).length;
        for (let elem of data) {
            elem.variants = await (0, MediaManagerHelper_1.populateVariants)(elem.variants, this.model);
        }
        return {
            data: data,
            next: !!next,
        };
    }
    async searchAll(s, group) {
        let data = await sails.models[this.model].find({
            where: { filename: { contains: s }, parent: null, group: group },
            sort: "createdAt DESC",
        }).populate("variants", { sort: "createdAt DESC" }).populate('meta');
        for (let elem of data) {
            elem.variants = await (0, MediaManagerHelper_1.populateVariants)(elem.variants, this.model);
        }
        return data;
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
                .populate("variants", { sort: "createdAt DESC" }))[0];
            widgetItems.push({
                id: file.id,
                mimeType: file.mimeType,
                url: file.url,
                variants: file.variants,
            });
        }
        return widgetItems;
    }
}
exports.DefaultMediaManager = DefaultMediaManager;
