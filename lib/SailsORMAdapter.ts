import {AbstractAdapter, AbstractModel} from "adminizer/lib/v4/model/AbstractModel";
import {v4 as uuid} from "uuid";
import Waterline, {Config} from "waterline";
import path from "node:path";
import fs from "fs";
import {pathToFileURL} from "url";

export class WaterlineModel<T> extends AbstractModel<T> {
  private model: any;

  constructor(modelName: string, model: any) {
    super(modelName, model.attributes, model.primaryKey, model.identity);
    if (!model) {
      throw new Error('Model instance must be provided.');
    }
    this.model = model;
  }

  protected async _create(data: T): Promise<T> {
    return await this.model.create(data).fetch();
  }

  /** Custom populate all function */
  private async populateAll(query: any, model: any) {
    // Get 'model' and 'collection' fields
    const associations = Object.keys(model.attributes)
      .filter(attr => model.attributes[attr].model || model.attributes[attr].collection);

    // Dynamically populate all associations
    associations.forEach(attr => {
      query = query.populate(attr);
    });

    return query;
  }

  protected async _findOne(criteria: Partial<T>): Promise<T | null> {
    let query = this.model.findOne(criteria);
    query = await this.populateAll(query, this.model);
    return await query;
  }

  protected async _find(criteria: Partial<T> = {}, options: FindOptions = {}): Promise<T[]> {
    let query = this.model.find(criteria);

    if (options.populate && Array.isArray(options.populate) && options.populate.length > 0) {
      options.populate.forEach(([field, populateCriteria]: [string, any]) => {
        if (typeof field === "string") {
          query = query.populate(field, populateCriteria || {});
        }
      });

    } else {
      query = await this.populateAll(query, this.model);
    }

    if (options.limit && typeof options.limit === "number") {
      query = query.limit(options.limit);
    }
    let result = await query;
    
    return result;
  }

  protected async _updateOne(criteria: Partial<T>, data: Partial<T>): Promise<T | null> {
    return await this.model.updateOne(criteria).set(data);
  }

  protected async _update(criteria: Partial<T>, data: Partial<T>): Promise<T[]> {
    return await this.model.update(criteria).set(data).fetch();
  }

  protected async _destroyOne(criteria: Partial<T>): Promise<T | null> {
    return await this.model.destroyOne(criteria);
  }

  protected async _destroy(criteria: Partial<T>): Promise<T[]> {
    return await this.model.destroy(criteria).fetch();
  }

  protected async _count(criteria: Partial<T> = {}): Promise<number> {
    return await this.model.count(criteria);
  }
}


export class WaterlineAdapter extends AbstractAdapter {
  public Model: any = WaterlineModel;

  /** In case of waterline, we are storing complex object in "orm" field of our AbstractAdapter.
   * It contains waterline orm and waterline ontology. One for storing methods like registerModel and initialize,
   * the other for storing collections with methods find, create etc. Also, we need waterlineConfig */
  constructor(orm: {orm: Waterline.Waterline, ontology: Waterline.Ontology}) {
    super("waterline", orm);
  }

  get models(): Record<string, any> {
    return this.orm.ontology.collections;
  }

  getModel(modelName: string): Record<string, any> {
    return this.orm.ontology.collections[modelName];
  }

  getAttributes(modelName: string): Waterline.Attributes {
    const model = this.orm.ontology.collections[modelName];
    if (!model) {
      throw new Error(`Model "${modelName}" was not found`);
    }

    return model.attributes;
  }

  /** Method that processes custom waterline model creation. Is used for system models. Replaces beforeCreate method in waterline */
  static async registerSystemModels(waterlineORM: Waterline.Waterline): Promise<void> {
    const systemModelsDir = path.resolve(import.meta.dirname, "../../../../models");

    let systemModelsFiles = fs.readdirSync(systemModelsDir).filter(file => file.endsWith(".js"));

    if (!systemModelsFiles.length) {
      systemModelsFiles = fs.readdirSync(systemModelsDir).filter(file =>
        file.endsWith(".ts") && !file.endsWith(".d.ts")
      );
    }
    // Register adminizer system models
    await Promise.all(systemModelsFiles.map(async (file) => {
      const modelName = path.basename(file).replace(/\.(ts|js)$/, "");
      const systemModelPath = path.resolve(systemModelsDir, file);
      const adminizerModel = (await import(pathToFileURL(systemModelPath).href)).default;
      const waterlineLikeModel = generateWaterlineModel(modelName, adminizerModel);

      // Register model in Waterline ORM
      waterlineORM.registerModel(waterlineLikeModel);
    }))

    function generateWaterlineModel(modelName: string, attributes: any) {
      const primaryKey = Object.keys(attributes).find(fieldName =>
        attributes[fieldName]?.primaryKey === true
      );

      if (!primaryKey) {
        throw new Error(`Model "${modelName}" must have a primary key.`);
      }

      // Bind beforeCreate hook for creating UUID
      let beforeCreate = (record: any, cb: (err?: Error | string) => void) => cb();
      if (attributes[primaryKey]?.uuid === true && attributes[primaryKey]?.type === "string") {
        beforeCreate = (record: any, cb: (err?: Error | string) => void) => {
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
        datastore: 'default',
        primaryKey: primaryKey,
        attributes: attributes,
        beforeCreate: beforeCreate
      });
    }
  }
}