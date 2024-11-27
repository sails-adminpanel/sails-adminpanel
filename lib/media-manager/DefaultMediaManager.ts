import path = require("node:path");
import {
    AbstractMediaManager,
    MediaManagerItem,
    File,
    MediaManagerWidgetItem,
    MediaManagerWidgetData,
    MediaManagerWidgetClientItem,
    SortCriteria,
} from "./AbstractMediaManager";
import { populateVariants } from "./helpers/MediaManagerHelper";
import { ApplicationItem, ImageItem, TextItem, VideoItem } from "./Items";



export class DefaultMediaManager extends AbstractMediaManager {
    public readonly itemTypes: File<MediaManagerItem>[] = [];
    public model: string = "mediamanagerap";
    public modelAssoc: string = "mediamanagerassociationsap";       
    id: string;
    path: string;
    dir: string;

    constructor(id: string, urlPathPrefix: string, fileStoragePath: string) {
        super();
        this.id = id;
        this.path = urlPathPrefix;
        this.dir = fileStoragePath;    
        this.itemTypes.push(new ImageItem(urlPathPrefix, fileStoragePath));
        this.itemTypes.push(new TextItem(urlPathPrefix, fileStoragePath));
        this.itemTypes.push(new ApplicationItem(urlPathPrefix, fileStoragePath));
        this.itemTypes.push(new VideoItem(urlPathPrefix, fileStoragePath));
    }

    public async getAll(limit: number, skip: number, sort: SortCriteria, group: string): Promise<{ data: MediaManagerItem[]; next: boolean }> {
        let data: MediaManagerItem[] = await sails.models[this.model]
            .find({
                where: { parent: null, group: group },
                limit: limit,
                skip: skip,
                sort: sort, //@ts-ignore
            })
            .populate("variants", { sort: sort }).populate('meta');

        let next: number = (
            await sails.models[this.model].find({
                where: { parent: null, group: group },
                limit: limit,
                skip: skip === 0 ? limit : skip + limit,
                sort: sort,
            })
        ).length;

        for (let elem of data) {
            elem.variants = await populateVariants(elem.variants, this.model)
        }

        return {
            data: data,
            next: !!next,
        };
    }

    public async searchAll(s: string, group: string): Promise<MediaManagerItem[]> {
        let data: MediaManagerItem[] = await sails.models[this.model].find({
            where: { filename: { contains: s }, parent: null, group: group },
            sort: "createdAt DESC",
        }).populate("variants", { sort: "createdAt DESC" }).populate('meta')
        // This limitation is made strictly, if your code solves this please make a PR
        .limit(1000);

        for (let elem of data) {
            elem.variants = await populateVariants(elem.variants, this.model)
        }

        return data;
    }

    public async setRelations(data: MediaManagerWidgetData, model: string, modelId: string, widgetName: string,): Promise<void> {
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

    public async getRelations(items: MediaManagerWidgetItem[],): Promise<MediaManagerWidgetClientItem[]> {
        let widgetItems: MediaManagerWidgetClientItem[] = [];
        for (const item of items) {
            let file = (
                await sails.models[this.model]
                    .find({ where: { id: item.id } })
                    .populate("variants", { sort: "createdAt DESC" })
            )[0] as MediaManagerItem;
            if(!file) continue
            widgetItems.push({
                id: file.id,
                mimeType: file.mimeType,
                url: file.url,
                variants: file.variants,
            });
        }
        return widgetItems;
    }

    // public async updateRelations(
    //     data: MediaManagerWidgetData,
    //     model: string,
    //     modelId: string,
    //     modelAttribute: string,
    // ): Promise<void> {
    //     await this.deleteRelations(model, modelId);
    //     await this.setRelations(data, model, modelId, modelAttribute);
    // }

    // public async deleteRelations(
    //     model: string,
    //     modelId: string,
    // ): Promise<void> {
    //     let modelAssociations = await sails.models[this.modelAssoc].find({
    //         where: { modelId: modelId, model: model },
    //     });
    //     for (const modelAssociation of modelAssociations) {
    //         await sails.models[this.modelAssoc]
    //             .destroy(modelAssociation.id)
    //             .fetch();
    //     }
    // }
}
