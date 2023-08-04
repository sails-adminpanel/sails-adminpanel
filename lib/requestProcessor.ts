let queryString = require('querystring');

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
    public static addGetParams(req, params) {
        if (!req || typeof req.query !== "object") throw new Error('Wrong request given !');
        if (typeof params !== "object") {
            params = {};
        }
        let query = {...req.query, ...params};
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
    public static uploadFile(key, val, field, cb) {
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
    public static async processFiles(req, fields) {
        let fileFieldKeys = [];
        for (let key in fields) {
            if (fields[key].config && fields[key].config.file) {
                fileFieldKeys.push(key)
            }
        }

        if (fileFieldKeys.length == 0) {
            return;
        }

        let files = {};
        for await (let elem of fileFieldKeys) {
            try {
                await req.file(elem).upload(function(err, file) {
                    if (err) {
                        return err;
                    }
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
    public static processRequest(req, fields) {
        // let booleanFields = {};

        // for (let key of Object.keys(fields)) {
        //     if (fields[key].config.type === 'boolean') {
        //         booleanFields[key] = Boolean(data[key]);
        //     }
        // }

        let data = req.allParams();
        let postParams = {};
        // Only fileds data
        for (let key of Object.keys(data)) {
            if (Boolean(fields[key])) {
                postParams[key] = data[key]
            }
        }

        for (let key in postParams) {
            let field = fields[key];
            if (field.model.type == 'boolean') {
                postParams[key] = ['true', '1', 'yes', "TRUE"].includes(postParams[key].toString().toLowerCase());
                continue;
            }
            
            if (field.model.type == 'number') {
                postParams[key] = parseFloat(postParams[key]);
            }

            if (field.model.type == 'json') {
                try {
                    postParams[key] = JSON.parse(postParams[key]);
                } catch (error) {
                    // show error only when string and when string is not empty
                    if (typeof postParams[key] === "string" && postParams[key].replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                        sails.log.error(`Adminpanel > processRequest: json parse error when parsing ${postParams[key]}`, error)
                    }
                }
            }

            //remove empty field from list
            if (field.model.type == 'association' && !postParams[key]) {
                delete postParams[key];
            }
        }

        // // Hook for setting boolean vars to false.
        // // HTTP wouldn't send data here
        // for (let key in booleanFields) {
        //     if (!postParams[key]) {
        //         postParams[key] = false;
        //     }
        // }

        return postParams;
    }
}
