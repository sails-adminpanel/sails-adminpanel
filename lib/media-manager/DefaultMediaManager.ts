import {
    AbstractMediaManager,
    Item,
    File,
    MediaManagerWidgetItem,
    Data,
} from "./AbstractMediaManager";
import { populateVariants } from "./helpers/MediaManagerHelper";
import { ApplicationItem, ImageItem, TextItem, VideoItem } from "./Items";

export class DefaultMediaManager extends AbstractMediaManager {
    public readonly itemTypes: File<Item>[] = [];
    public model: string = "mediamanagerap";
    public modelAssoc: string = "mediamanagerassociationsap";

    constructor(id: string, path: string, dir: string) {
        super(id, path, dir);
        this.itemTypes.push(new ImageItem(path, dir));
        this.itemTypes.push(new TextItem(path, dir));
        this.itemTypes.push(new ApplicationItem(path, dir));
        this.itemTypes.push(new VideoItem(path, dir));
    }

    public async getAll(limit: number, skip: number, sort: string, group: string): Promise<{ data: Item[]; next: boolean }> {
        let data: Item[] = await sails.models[this.model]
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

    public async searchAll(s: string, group: string): Promise<Item[]> {
        let data: Item[] = await sails.models[this.model].find({
            where: { filename: { contains: s }, parent: null, group: group },
            sort: "createdAt DESC",
        }).populate("variants", { sort: "createdAt DESC" }).populate('meta');

        for (let elem of data) {
            elem.variants = await populateVariants(elem.variants, this.model)
        }

        return data;
    }

    public async saveRelations(data: Data, model: string, modelId: string, widgetName: string,): Promise<void> {
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

    public async getRelations(items: MediaManagerWidgetItem[],): Promise<MediaManagerWidgetItem[]> {
        interface widgetItemVUE extends MediaManagerWidgetItem {
            mimeType: string;
            variants: Item[];
            url: string;
        }
        let widgetItems: widgetItemVUE[] = [];
        for (const item of items) {
            let file = (
                await sails.models[this.model]
                    .find({ where: { id: item.id } })
                    .populate("variants", { sort: "createdAt DESC" })
            )[0] as Item;
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
    //     data: Data,
    //     model: string,
    //     modelId: string,
    //     modelAttribute: string,
    // ): Promise<void> {
    //     await this.deleteRelations(model, modelId);
    //     await this.saveRelations(data, model, modelId, modelAttribute);
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