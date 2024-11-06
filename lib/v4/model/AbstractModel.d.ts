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
    abstract create(data: T): Promise<T>;
    abstract findOne(id: string | number): Promise<T | null>;
    abstract find(criteria?: Partial<T>): Promise<T[]>;
    abstract updateOne(id: string | number, data: Partial<T>): Promise<T | null>;
    abstract update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
    abstract destroyOne(id: string | number): Promise<T | null>;
    abstract destroy(criteria: Partial<T>): Promise<T[]>;
    abstract count(criteria?: Partial<T>): Promise<number>;
}
