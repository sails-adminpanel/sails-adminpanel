import { AbstractMediaManager, MediaManagerItem, File, MediaManagerWidgetItem, MediaManagerWidgetData, MediaManagerWidgetClientItem, SortCriteria } from "./AbstractMediaManager";
export declare class DefaultMediaManager extends AbstractMediaManager {
    readonly itemTypes: File<MediaManagerItem>[];
    model: string;
    modelAssoc: string;
    constructor(id: string, path: string, dir: string);
    getAll(limit: number, skip: number, sort: SortCriteria, group: string): Promise<{
        data: MediaManagerItem[];
        next: boolean;
    }>;
    searchAll(s: string, group: string): Promise<MediaManagerItem[]>;
    setRelations(data: MediaManagerWidgetData, model: string, modelId: string, widgetName: string): Promise<void>;
    getRelations(items: MediaManagerWidgetItem[]): Promise<MediaManagerWidgetClientItem[]>;
}
