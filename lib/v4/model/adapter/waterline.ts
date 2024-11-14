import {AbstractModel} from "../AbstractModel";

export class Waterline<T> extends AbstractModel<T> {
  private model: any;

  constructor(modelname: string, model: any) {
    super(modelname, model.attributes, model.primaryKey, model.identity);
    if (!model) {
      throw new Error('Model instance must be provided.');
    }
    this.model = model;
  }

  protected async create(data: T): Promise<T> {
    return await this.model.create(data).fetch();
  }

  protected async findOne(criteria: Partial<T>): Promise<T | null> {
    return await this.model.findOne(criteria)
      /** TODO: resolve populate all */
      .populateAll();
  }

  protected async find(criteria: Partial<T> = {}): Promise<T[]> {
    return await this.model.find(criteria)
      /** TODO: resolve populate all */
      .populateAll();
  }

  protected async updateOne(criteria: Partial<T>, data: Partial<T>): Promise<T | null> {
    return await this.model.updateOne(criteria).set(data);
  }

  protected async update(criteria: Partial<T>, data: Partial<T>): Promise<T[]> {
    return await this.model.update(criteria).set(data).fetch();
  }

  protected async destroyOne(criteria: Partial<T>): Promise<T | null> {
    return await this.model.destroyOne(criteria);
  }

  protected async destroy(criteria: Partial<T>): Promise<T[]> {
    const deletedRecords = await this.model.destroy(criteria).fetch();
    return deletedRecords;
  }

  protected async count(criteria: Partial<T> = {}): Promise<number> {
    return await this.model.count(criteria);
  }
}
