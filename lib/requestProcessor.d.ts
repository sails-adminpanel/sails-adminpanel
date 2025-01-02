import { Fields } from "../helper/fieldsHelper";
type PostParams = Record<string, string | number | boolean | object | string[] | number[] | null>;
/**
 * Default helper that will contain all methods
 * that should help with processing request details and bind
 *
 * @type {*}
 */
export declare class RequestProcessor {
    /**
     * Will add new HTTP GET params to current params and will return a new string of GET query params.
     *
     * @param {Request} req
     * @param {Object} params
     * @returns {String}
     */
    static addGetParams(req: ReqTypeAP, params: {}): string;
    /**
     * Will fetch all files from request. That should be stored
     *
     * @param {Request} req
     * @param {Object} fields List of fileds config
     * @param {Function=} [cb]
     */
    static processFiles(req: ReqTypeAP, fields: Fields): Promise<any>;
    /**
     * Will try to find all fields that should be used in model
     *
     * @param {Request} req
     * @param {Object} fields
     * @param {Function=} [cb]
     * @see AdminUtil#getFields to know what data should be passed into fields
     * @returns {Object} List of processed values from request
     */
    static processRequest(req: ReqTypeAP, fields: Fields): PostParams;
}
export {};
