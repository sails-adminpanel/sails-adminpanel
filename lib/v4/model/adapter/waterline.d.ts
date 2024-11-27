import { AbstractModel } from "../AbstractModel";
export declare class Waterline<T> extends AbstractModel<T> {
    private model;
    constructor(modelname: string, model: any);
    create(data: T): Promise<T>;
    findOne(id: string | number): Promise<T | null>;
    find(criteria?: Partial<T>): Promise<T[]>;
    updateOne(id: string | number, data: Partial<T>): Promise<T | null>;
    update(criteria: Partial<T>, data: Partial<T>): Promise<T[]>;
    destroyOne(id: string | number): Promise<T | null>;
    destroy(criteria: Partial<T>): Promise<T[]>;
    count(criteria?: Partial<T>): Promise<number>;
}
