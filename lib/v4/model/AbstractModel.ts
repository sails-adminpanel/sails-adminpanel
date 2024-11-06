export interface Attribute {
  type: string;
  required?: boolean;
  unique?: boolean;
  defaultsTo?: any;
  columnName?: string;
  // Связи (ассоциации)
  model?: string; // Связь с моделью (один к одному или многие к одному)
  collection?: string; // Коллекция для связи "многие ко многим"
  via?: string; // Поле, через которое осуществляется связь
  // другие атрибуты, которые могут быть определены в модели
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

  abstract create(data: T): Promise<T>;
  abstract findOne(id: string | number): Promise<T | null>;
  abstract find(criteria?: Partial<T>): Promise<T[]>;
  abstract updateOne(id: string | number, data: Partial<T>): Promise<T | null>;
  abstract update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
  abstract destroyOne(id: string | number): Promise<T | null>;
  abstract destroy(criteria: Partial<T>): Promise<T[]>;
  abstract count(criteria?: Partial<T>): Promise<number>;

}