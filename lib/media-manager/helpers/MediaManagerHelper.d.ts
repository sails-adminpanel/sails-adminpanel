import { Fields } from "../../../helper/fieldsHelper";
import { MediaManagerItem, MediaManagerWidgetItem, MediaManagerWidgetJSON } from "../AbstractMediaManager";
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
export declare function getRelationsMediaManager(data: MediaManagerWidgetJSON): Promise<import("../AbstractMediaManager").MediaManagerWidgetClientItem[]>;
export declare function deleteRelationsMediaManager(model: string, record: {
    [p: string]: string | MediaManagerWidgetItem[];
}[]): Promise<void>;
/**
 * @param items
 */
export declare function populateVariants(variants: MediaManagerItem[], model: string): Promise<MediaManagerItem[]>;
export {};
