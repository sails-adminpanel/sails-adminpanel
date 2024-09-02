import { Fields } from "../../../helper/fieldsHelper";
import { WidgetItem, widgetJSON } from "../AbstractMediaManager";
type PostParams = Record<string, string | number | boolean | object | string[] | number[] | null>;
/**
 * Create a random file name with prefix and type. If prefix is true, the file name will be prefixed with a random string.
 * @param filenameOrig
 * @param type
 * @param prefix
 */
export declare function randomFileName(filenameOrig: string, type: string, prefix: boolean): string;
/**
 * Save media manager relations to database.
 * @param fields
 * @param reqData
 * @param model
 * @param recordId
 */
export declare function saveRelationsMediaManager(fields: Fields, reqData: PostParams, model: string, recordId: string): Promise<void>;
export declare function getRelationsMediaManager(data: widgetJSON): Promise<WidgetItem[]>;
export declare function updateRelationsMediaManager(fields: Fields, reqData: PostParams, model: string, recordId: string): Promise<void>;
export declare function deleteRelationsMediaManager(model: string, record: {
    [p: string]: string | WidgetItem[];
}[]): Promise<void>;
export {};
