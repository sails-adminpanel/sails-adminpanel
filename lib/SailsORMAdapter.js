import { AbstractAdapter, AbstractModel } from "adminizer";
import { v4 as uuid } from "uuid";
import Waterline from "waterline";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL, fileURLToPath } from "url";
export class WaterlineModel extends AbstractModel {
    model;
    constructor(modelName, model) {
        super(modelName, model.attributes, model.primaryKey, model.identity);
        if (!model) {
            throw new Error('Model instance must be provided.');
        }
        this.model = model;
    }
    async _create(data) {
        return await this.model.create(data).fetch();
    }
    /** Custom populate all function */
    async populateAll(query, model) {
        // Get 'model' and 'collection' fields
        const associations = Object.keys(model.attributes)
            .filter(attr => model.attributes[attr].model || model.attributes[attr].collection);
        // Dynamically populate all associations
        associations.forEach(attr => {
            query = query.populate(attr);
        });
        return query;
    }
    async _findOne(criteria) {
        let query = this.model.findOne(criteria);
        query = await this.populateAll(query, this.model);
        return await query;
    }
    async _find(criteria = {}, options = {}) {
        let query = this.model.find(criteria);
        if (options.populate && Array.isArray(options.populate) && options.populate.length > 0) {
            options.populate.forEach(([field, populateCriteria]) => {
                if (typeof field === "string") {
                    query = query.populate(field, populateCriteria || {});
                }
            });
        }
        else {
            query = await this.populateAll(query, this.model);
        }
        if (options.limit && typeof options.limit === "number") {
            query = query.limit(options.limit);
        }
        let result = await query;
        return result;
    }
    async _updateOne(criteria, data) {
        return await this.model.updateOne(criteria).set(data);
    }
    async _update(criteria, data) {
        return await this.model.update(criteria).set(data).fetch();
    }
    async _destroyOne(criteria) {
        return await this.model.destroyOne(criteria);
    }
    async _destroy(criteria) {
        return await this.model.destroy(criteria).fetch();
    }
    async _count(criteria = {}) {
        return await this.model.count(criteria);
    }
}
export class WaterlineAdapter extends AbstractAdapter {
    Model = WaterlineModel;
    /** In case of waterline, we are storing complex object in "orm" field of our AbstractAdapter.
     * It contains waterline orm and waterline ontology. One for storing methods like registerModel and initialize,
     * the other for storing collections with methods find, create etc. Also, we need waterlineConfig */
    constructor(orm) {
        super("waterline", orm);
    }
    get models() {
        return this.orm.ontology.collections;
    }
    getModel(modelName) {
        return this.orm.ontology.collections[modelName];
    }
    getAttributes(modelName) {
        const model = this.orm.ontology.collections[modelName];
        if (!model) {
            throw new Error(`Model "${modelName}" was not found`);
        }
        return model.attributes;
    }
    /** Method that processes custom waterline model creation. Is used for system models. Replaces beforeCreate method in waterline */
    static async registerSystemModels(waterlineORM) {
        const __dirname = import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));
        const systemModelsDir = path.resolve(__dirname, "../../../node_modules/adminizer/models");
        
        let systemModelsFiles = fs.readdirSync(systemModelsDir).filter(file => file.endsWith(".js"));
        if (!systemModelsFiles.length) {
            systemModelsFiles = fs.readdirSync(systemModelsDir).filter(file => file.endsWith(".ts") && !file.endsWith(".d.ts"));
        }
        // Register adminizer system models
        await Promise.all(systemModelsFiles.map(async (file) => {
            const modelName = path.basename(file).replace(/\.(ts|js)$/, "");
            const systemModelPath = path.resolve(systemModelsDir, file);
            const adminizerModel = (await import(pathToFileURL(systemModelPath).href)).default;
            const waterlineLikeModel = generateWaterlineModel(modelName, JSON.parse(JSON.stringify(adminizerModel)));
            // Register model in Waterline ORM
            waterlineORM.registerModel(waterlineLikeModel);
        }));
        function generateWaterlineModel(modelName, attributes) {
            // Make a deep copy to avoid modifying the original
            attributes = JSON.parse(JSON.stringify(attributes));
            const primaryKey = Object.keys(attributes).find(fieldName => attributes[fieldName]?.primaryKey === true);
            if (!primaryKey) {
                throw new Error(`Model "${modelName}" must have a primary key.`);
            }
            // Bind beforeCreate hook for creating UUID
            let beforeCreate = (record, cb) => cb();
            if (attributes[primaryKey]?.uuid === true && attributes[primaryKey]?.type === "string") {
                beforeCreate = (record, cb) => {
                    if (!record.id) {
                        record.id = uuid();
                    }
                    cb();
                };
                // Delete uuid field after processing
                delete attributes[primaryKey].uuid;
            }
            // Moving autoincrement and unique fields into autoMigrations
            Object.keys(attributes).forEach((key) => {
                if (!attributes[key].autoMigrations) {
                    attributes[key].autoMigrations = {};
                }
                if (attributes[key].autoIncrement) {
                    attributes[key].autoMigrations.autoIncrement = true;
                    delete attributes[key].autoIncrement;
                }
                if (attributes[key].unique) {
                    attributes[key].autoMigrations.unique = true;
                    delete attributes[key].unique;
                }
            });
            // Delete primaryKey key, waterline does not want it (wants only in upper level)
            delete attributes[primaryKey].primaryKey;
            return Waterline.Collection.extend({
                identity: modelName.toLowerCase(),
                datastore: 'adminizer', // Используем уникальное имя datastore
                primaryKey: primaryKey,
                attributes: attributes,
                beforeCreate: beforeCreate
            });
        }
    }
}
