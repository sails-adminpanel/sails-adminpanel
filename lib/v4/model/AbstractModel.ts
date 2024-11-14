import {DataAccessor} from "../DataAccessor";

export interface Attribute {
  type: string;
  required?: boolean;
  unique?: boolean;
  defaultsTo?: any;
  columnName?: string;
  model?: string;
  collection?: string;
  via?: string;
}

export interface ModelAttributes {
  [key: string]: Attribute;
}

export type ModelAnyField = number | string | boolean | Date | Array<number | string | boolean> | { [key: string]: number | string | boolean | Date };


export type ModelAnyInstance = {
  [key: string]: ModelAnyField
}

export abstract class AbstractModel<T> {
  public readonly modelname: string;
  public readonly attributes: ModelAttributes;
  public readonly primaryKey: string;
  public readonly identity: string;

  constructor(modelname: string, attributes: ModelAttributes, primaryKey: string, identity: string) {
    this.modelname = modelname;
    this.attributes = attributes;
    this.primaryKey = primaryKey;
    this.identity = identity;
  }

  protected abstract create(data: Partial<T>): Promise<T>;
  protected abstract findOne(criteria: Partial<T>): Promise<T | null>;
  protected abstract find(criteria: Partial<T>): Promise<T[]>;
  protected abstract updateOne(criteria: Partial<T>, data: Partial<T>): Promise<T | null>;
  protected abstract update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
  protected abstract destroyOne(criteria: Partial<T>): Promise<T | null>;
  protected abstract destroy(criteria: Partial<T>): Promise<T[]>;
  protected abstract count(criteria: Partial<T> | undefined): Promise<number>;

  public async _create(data: T, dataAccessor: DataAccessor): Promise<Partial<T>> {
    let _data = dataAccessor.process(data);
    let record = await this.create(_data);
    return dataAccessor.process(record);
  }

  public async _findOne(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T> | null> {
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let record = await this.findOne(criteria);
    return record ? dataAccessor.process(record) : null;
  }

  public async _find(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]> {
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let records = await this.find(criteria);
    return records.map(record => dataAccessor.process(record));
  }

  public async _updateOne(criteria: Partial<T>, data: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T> | null> {
    let _data = dataAccessor.process(data);
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let record = await this.updateOne(criteria, _data);
    return record ? dataAccessor.process(record) : null;
  }

  public async _update(criteria: Partial<T>, data: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]> {
    let _data = dataAccessor.process(data);
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let records = await this.update(criteria, _data);
    return records.map(record => dataAccessor.process(record));
  }

  public async _destroyOne(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T> | null> {
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let record = await this.destroyOne(criteria);
    return record ? dataAccessor.process(record) : null;
  }

  public async _destroy(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]> {
    criteria = dataAccessor.sanitizeUserRelationAccess(criteria);
    let records = await this.destroy(criteria);
    return records.map(record => dataAccessor.process(record));
  }

  public async _count(criteria: Partial<T> | undefined): Promise<number> {
    return this.count(criteria);
  }

}
