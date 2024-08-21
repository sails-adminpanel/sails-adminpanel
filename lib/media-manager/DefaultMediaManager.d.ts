import { AbstractMediaManager, Item, File } from "./AbstractMediaManager";
export declare class DefaultMediaManager extends AbstractMediaManager {
    readonly itemTypes: File<Item>[];
    constructor(id: string, path: string, dir: string, model: string, metaModel: string);
    getAll(limit: number, skip: number, sort: string): Promise<{
        data: Item[];
        next: boolean;
    }>;
}
