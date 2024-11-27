import { AbstractModel } from "../AbstractModel";
export declare class Waterline<T> extends AbstractModel<T> {
    private model;
    constructor(modelname: string, model: any);
    protected create(data: T): Promise<T>;
    protected findOne(criteria: Partial<T>): Promise<T | null>;
    protected find(criteria?: Partial<T>): Promise<T[]>;
    protected updateOne(criteria: Partial<T>, data: Partial<T>): Promise<T | null>;
    protected update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
    protected destroyOne(criteria: Partial<T>): Promise<T | null>;
    protected destroy(criteria: Partial<T>): Promise<T[]>;
    protected count(criteria?: Partial<T>): Promise<number>;
}
