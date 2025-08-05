import path from "node:path";
import _ from "lodash";
import buildDictionary from "sails-build-dictionary";
import {fileURLToPath} from "url";
/**
 * Provide tools for hooks. Has only static methods.
 */
export class HookTools {
    static bindModels(sails, modelsToSkip) {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		const folder = path.join(__dirname, "..", "models");
		console.log(folder)
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

	static waitForHooks(selfName, hooks, cb) {
		const eventsToWaitFor = [];
		eventsToWaitFor.push("router:after");
		try {
			/**
			 * Check hooks availability
			 */
			_.forEach(hooks, function (hook) {
				if (!sails.hooks[hook]) {
					throw new Error("Cannot use `" + selfName + "` hook without the `" + hook + "` hook.");
				}
				eventsToWaitFor.push("hook:" + hook + ":loaded");
			});
		}
		catch (err) {
			if (err) {
				sails.log.error(err);
				return cb(err);
			}
		}
		sails.after(eventsToWaitFor, cb);
	}
}
