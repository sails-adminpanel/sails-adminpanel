import path from "node:path";
import _ from "lodash";
import buildDictionary from "sails-build-dictionary";

/**
 * Provide tools for hooks. Has only static methods.
 */
export class HookTools {
	static async registerSystemModels(modelsToSkip) {
		const folder = path.join(__dirname, "..", "models");
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
					let primaryKey = 'id'; // значение по умолчанию

					// Сначала проверяем, есть ли primaryKey на верхнем уровне
					if (originalModel.primaryKey) {
						primaryKey = originalModel.primaryKey;
					}

					if(modelName === 'mediamanagermetaap' || modelName === 'mediamanagerassociationsap' || modelName === 'mediamanagerap') {
						if (originalModel.id) {
							delete originalModel.id;
						}

						originalModel.id = {
							type: "number",
							autoIncrement: true,
							primaryKey: true
						};
					}

					Object.entries(originalModel).forEach(([key, value]) => {
						if (typeof value === 'function') {
							methods[key] = value;
						} else if (key === 'primaryKey') {
							// Уже обработали выше
						} else if (value && (value.type || value.model || value.collection || value.via)) {
							if (value.type === 'string' && value.uuid === true) {
								value.isUUID = true;
								delete value.uuid;
							}

							attributes[key] = _.cloneDeep(value);

							// Если атрибут помечен как primaryKey, сохраняем это и удаляем из атрибута
							if (attributes[key]?.primaryKey) {
								primaryKey = key;
								delete attributes[key].primaryKey; // Удаляем, так как Sails 1.0 это не разрешает
							}

							if (attributes[key].field) {
								attributes[key].columnName = attributes[key].field;
								// Оставляем field для Waterline
							}

							// Удаляем type только для ассоциаций, которые не имеют явного type
							if ((value.model || value.collection) && !value.type) {
								delete attributes[key].type;
							}
						}
					});

					// Устанавливаем primaryKey на верхнем уровне модели для Sails 1.0
					models[modelName] = {
						primaryKey: primaryKey,
						attributes,
						...methods
					};
				});

				sails.models = _.merge(sails.models || {}, models);
				resolve();
			});
		});
	}
}
