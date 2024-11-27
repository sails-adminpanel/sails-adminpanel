import { AbstractModel } from "./AbstractModel";
export declare class ModelHandler {
    private static models;
    static registerModel<T>(modelName: string, modelInstance: AbstractModel<T>): void;
    static get model(): Map<string, AbstractModel<any>>;
}
