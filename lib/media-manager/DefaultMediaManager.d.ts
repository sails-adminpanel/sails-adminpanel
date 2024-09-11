import { AbstractMediaManager, Item, File, MediaManagerWidgetItem, Data } from "./AbstractMediaManager";
export declare class DefaultMediaManager extends AbstractMediaManager {
    readonly itemTypes: File<Item>[];
    model: string;
    modelAssoc: string;
    constructor(id: string, path: string, dir: string);
    getAll(limit: number, skip: number, sort: string, group: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
    searchAll(s: string, group: string): Promise<Item[]>;
    saveRelations(data: Data, model: string, modelId: string, widgetName: string): Promise<void>;
    getRelations(items: MediaManagerWidgetItem[]): Promise<MediaManagerWidgetItem[]>;
}
