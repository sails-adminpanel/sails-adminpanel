import path from "node:path";
import _ from "lodash";
import buildDictionary from "sails-build-dictionary";
/**
 * Provide tools for hooks. Has only static methods.
 */
export class HookTools {
    static async bindModels(modelsToSkip) {
		const folder = path.join(process.cwd(), 'node_modules/adminizer/models')
        return new Promise((resolve, reject) => {
            buildDictionary.optional({
                dirname: folder,
                filter: /^([^.]+)\.(js)$/,
                replaceExpr: /^.*\//,
                flattenDirectories: true,
            }, function (err, models) {
                if (err)
                    return reject(err);
                // skip models declared in modelsToSkip
                if (modelsToSkip && modelsToSkip.length) {
                    for (const modelToSkip of modelsToSkip) {
                        delete models[modelToSkip];
                    }
                }
                sails.models = _.merge(sails.models || {}, models);
                return resolve();
            });
        });
    }
}
