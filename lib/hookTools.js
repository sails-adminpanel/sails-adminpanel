import path from "node:path";
import _ from "lodash";
import buildDictionary from "sails-build-dictionary";

/**
 * Provide tools for hooks. Has only static methods.
 */
export class HookTools {
	static async registerSystemModels(modelsToSkip) {
		// const __filename = fileURLToPath(import.meta.url);
		// const __dirname = path.dirname(__filename);
		//
		// const folder = path.join(__dirname, "..", "models");
		const folder = path.join(process.cwd(), 'node_modules/adminizer/models')
		return new Promise((resolve, reject) => {
			buildDictionary.optional({
				dirname: folder,
				filter: /^([^.]+)\.(js)$/,
				replaceExpr: /^.*\//,
				flattenDirectories: true,
			}, (err, models) => {
				if (err) return reject(err);

				Object.entries(models).forEach(([modelName, modelDef]) => {
					if (modelsToSkip?.includes(modelName)) {
						delete models[modelName];
						return;
					}

					const originalModel = modelDef.default || modelDef;
					const attributes = {};
					const methods = {};
					let primaryKey = 'id';

					Object.entries(originalModel).forEach(([key, value]) => {
						if (typeof value === 'function') {
							methods[key] = value;
						} else if (key === 'primaryKey') {
							// Обрабатывается отдельно
						} else if (value && (value.type || value.model || value.collection || value.via)) {
							// Нормализация правил валидации UUID
							if (value.type === 'string' && value.uuid === true) {
								value.isUUID = true;
								delete value.uuid;
							}

							attributes[key] = _.cloneDeep(value);

							if (attributes[key]?.primaryKey) {
								primaryKey = key;
								delete attributes[key].primaryKey;
							}
						}
					});

					if (originalModel.primaryKey) {
						primaryKey = originalModel.primaryKey;
					}

					models[modelName] = { primaryKey, attributes, ...methods };
				});

				sails.models = _.merge(sails.models || {}, models);
				resolve();
			});
		});
	}
}
