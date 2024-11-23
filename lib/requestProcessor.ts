import { Fields } from "../helper/fieldsHelper";
import {BaseFieldConfig} from "../interfaces/adminpanelConfig";

let queryString = require('querystring');
type PostParams = Record<string, string | number | boolean | object | string[] | number[] | null >;

/**
 * Default helper that will contain all methods
 * that should help with processing request details and bind
 *
 * @type {*}
 */
export class RequestProcessor {

    /**
     * Will add new HTTP GET params to current params and will return a new string of GET query params.
     *
     * @param {Request} req
     * @param {Object} params
     * @returns {String}
     */
    public static addGetParams(req: ReqType, params: {}): string {
        if (!req || typeof req.query !== "object") throw new Error('Wrong request given !');
        if (typeof params !== "object") {
            params = {};
        }
        let query = {...req.query, ...params};
        return queryString.stringify(query);
    }

    /**
     * Will fetch all files from request. That should be stored
     *
     * @param {Request} req
     * @param {Object} fields List of fileds config
     * @param {Function=} [cb]
     */
    public static async processFiles(req: ReqType, fields: Fields) {
        let fileFieldKeys = [];
        for (let key in fields) {
            let fieldConfigConfig = fields[key].config as BaseFieldConfig & {file: string};
            if (fields[key].config && fieldConfigConfig.file) {
                fileFieldKeys.push(key)
            }
        }

        if (fileFieldKeys.length == 0) {
            return;
        }

        let files = {};
        for await (let elem of fileFieldKeys) {
            try {
                //@ts-ignore
                req.file(elem).upload((err: Error, file)  => {
                    if (err) {
                        return err;
                    }
                    //@ts-ignore
                    files[elem] = file;
                });
            } catch (e) {
                sails.log.error(e);
                return e;
            }
        }

        return files;
    }



    /**
     * Will try to find all fields that should be used in model
     *
     * @param {Request} req
     * @param {Object} fields
     * @param {Function=} [cb]
     * @see AdminUtil#getFields to know what data should be passed into fields
     * @returns {Object} List of processed values from request
     */

    public static processRequest(req: ReqType, fields: Fields): PostParams {
        let data = req.allParams();
        let postParams: PostParams = {};

        for (let key of Object.keys(data)) {
            if (fields[key]) {
                postParams[key] = data[key];
            }
        }

        for (let key in postParams) {
            let field = fields[key];

            if (field.model.type === 'boolean') {
                postParams[key] = ['true', '1', 'yes', "TRUE", "on"].includes(postParams[key].toString().toLowerCase());
                continue;
            }

            if (field.model.type === 'number') {
                postParams[key] = parseFloat(postParams[key] as string);
            }

            if (field.model.type === 'json') {
                try {
                    postParams[key] = JSON.parse(postParams[key] as string);
                } catch (error) {
                    if (typeof postParams[key] === "string" && (postParams[key] as string).trim()) {
                        sails.log.error(`Adminpanel > processRequest: json parse error when parsing ${postParams[key]}`, error);
                    }
                }
            }

            if (field.model.type === 'association' && !postParams[key]) {
                delete postParams[key];
            }
        }

        return postParams;
    }
}
