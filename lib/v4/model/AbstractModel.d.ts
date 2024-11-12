import { DataAccessor } from "../DataAccessor";
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
export type ModelAnyField = number | string | boolean | Date | Array<number | string | boolean> | {
    [key: string]: number | string | boolean | Date;
};
export type ModelAnyInstance = {
    [key: string]: ModelAnyField;
};
export declare abstract class AbstractModel<T> {
    readonly modelname: string;
    readonly attributes: ModelAttributes;
    readonly primaryKey: string;
    readonly identity: string;
    constructor(modelname: string, attributes: ModelAttributes, primaryKey: string, identity: string);
    protected abstract create(data: Partial<T>): Promise<T>;
    protected abstract findOne(id: string | number): Promise<T | null>;
    protected abstract find(criteria: Partial<T>): Promise<T[]>;
    protected abstract updateOne(id: string | number, data: Partial<T>): Promise<T | null>;
    protected abstract update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
    protected abstract destroyOne(id: string | number): Promise<T | null>;
    protected abstract destroy(criteria: Partial<T>): Promise<T[]>;
    protected abstract count(criteria: Partial<T> | undefined): Promise<number>;
    _create(data: T, dataAccessor: DataAccessor): Promise<Partial<T>>;
    _findOne(id: string | number, dataAccessor: DataAccessor): Promise<Partial<T> | null>;
    _find(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]>;
    _updateOne(id: string | number, data: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T> | null>;
    _update(criteria: Partial<T>, data: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]>;
    _destroyOne(id: string | number, dataAccessor: DataAccessor): Promise<Partial<T> | null>;
    _destroy(criteria: Partial<T>, dataAccessor: DataAccessor): Promise<Partial<T>[]>;
    _count(criteria: Partial<T> | undefined): Promise<number>;
}
