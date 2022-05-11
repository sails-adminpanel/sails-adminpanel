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
     * upload file to server
     *
     * @param {string} key
     * @param {*} val
     * @param {Object} field
     * @param {Function=} [cb]
     * @returns {?string}
     */
    static uploadFile(key, val, field, cb) {
        // !TODO fix this, there is no req in parameters
        // if (!key || !val || !field) {
        //     return null;
        // }
        //
        // if (!req.file || typeof req.file !== "function") {
        //     return null;
        // }
        //
        // let options = {};
        // if (field.config.uploadPath) {
        //     options.dirname = field.config.uploadPath;
        // }
        //
        // req.file(key).upload(options, cb);
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
                await req.file(elem).upload(function (err, file) {
                    if (err) {
                        return err;
                    }
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
    static async processRequest(req, fields) {
        let booleanFields = {};
        for (let key of fields) {
            if (fields[key].config.type === 'boolean') {
                booleanFields[key] = fields[key];
            }
        }
        console.log("booleanFields", booleanFields);
        let data = req.allParams();
        let postParams = {};
        for (let key of data) {
            if (Boolean(fields[key])) {
                postParams[key] = data[key];
            }
        }
        console.log("postParams", postParams);
        for (let key in postParams) {
            let field = fields[key];
            if (field.model.type == 'boolean') {
                if (postParams[key] === '0') {
                    postParams[key] = false;
                }
                postParams[key] = Boolean(postParams[key]);
            }
            //if (field.model.type == 'integer') {
            //    postParams[key] = parseInt(val) || null;
            //}
            if (field.model.type == 'number') {
                postParams[key] = parseFloat(postParams[key]);
            }
            if (field.model.type == 'json') {
                try {
                    postParams[key] = JSON.parse(postParams[key]);
                }
                catch (error) {
                    sails.log.error("Adminpanel > processRequest: json parse error", error);
                }
            }
            //remove empty field from list
            if (field.model.type == 'association' && !postParams[key]) {
                delete postParams[key];
            }
        }
        // Hook for seting boolean vars to false.
        // HTTP wouldn't send data here
        for (let key in booleanFields) {
            if (!postParams[key]) {
                postParams[key] = false;
            }
        }
        return postParams;
    }
}
exports.RequestProcessor = RequestProcessor;
