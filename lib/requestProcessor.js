"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestProcessor = void 0;
let queryString = require('querystring');
/**
 * Default helper that will contain all methods
 * that should help with processing request details and bind
 *
 * @type {*}
 */
class RequestProcessor {
    /**
     * Will add new HTTP GET params to current params and will return a new string of GET query params.
     *
     * @param {Request} req
     * @param {Object} params
     * @returns {String}
     */
    static addGetParams(req, params) {
        if (!req || typeof req.query !== "object")
            throw new Error('Wrong request given !');
        if (typeof params !== "object") {
            params = {};
        }
        let query = { ...req.query, ...params };
        return queryString.stringify(query);
    }
    /**
     * Will fetch all files from request. That should be stored
     *
     * @param {Request} req
     * @param {Object} fields List of fileds config
     * @param {Function=} [cb]
     */
    static async processFiles(req, fields) {
        let fileFieldKeys = [];
        for (let key in fields) {
            if (fields[key].config && fields[key].config.file) {
                fileFieldKeys.push(key);
            }
        }
        if (fileFieldKeys.length == 0) {
            return;
        }
        let files = {};
        for await (let elem of fileFieldKeys) {
            try {
                //@ts-ignore
                req.file(elem).upload((err, file) => {
                    if (err) {
                        return err;
                    }
                    //@ts-ignore
                    files[elem] = file;
                });
            }
            catch (e) {
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
    static processRequest(req, fields) {
        let data = req.allParams();
        let postParams = {};
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
                postParams[key] = parseFloat(postParams[key]);
            }
            if (field.model.type === 'json') {
                try {
                    postParams[key] = JSON.parse(postParams[key]);
                }
                catch (error) {
                    if (typeof postParams[key] === "string" && postParams[key].trim()) {
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
exports.RequestProcessor = RequestProcessor;
