import * as path from "path";

let buildDictionary = require('sails-build-dictionary');

export default function initializeAuthorization(cb) {
    /**
     * Model
     */
    buildDictionary.optional({
        dirname: path.resolve(__dirname, '../api/models'),
        filter: /^([^.]+)\.(js|coffee|litcoffee)$/,
        replaceExpr: /^.*\//,
        flattenDirectories: true
    }, function (err, models) {
        if (err) {
            return cb(err);
        }
        // Get any supplemental files
        buildDictionary.optional({
            dirname: path.resolve(__dirname, '../api/models'),
            filter: /(.+)\.attributes.json$/,
            replaceExpr: /^.*\//,
            flattenDirectories: true
        }, function (err, supplements) {
            if (err)
                return cb(err);

            // console.log('admin > init > ', models, supplements, sails.models, sails.hooks.orm.models);
            // var finalModels = {...models, ...supplements};
            // var temp = sails.models || {};
            // sails.models = {...sails.models, ...models, ...supplements};

            let finalModels = {...models, ...supplements};

            sails.hooks.orm.models = Object.assign(finalModels || {}, sails.hooks.orm.models || {});
            sails.models = Object.assign(finalModels || {}, sails.models || {});

            // console.log('sails.hooks.orm.models > ', sails.hooks.orm.models);
            // console.log('sails.models > ', sails.models);

        });
    });
};
