declare class ModelHandler {
    private models;
    registerModel<T>(modelName: string, modelInstance: AbstractModel<T>): void;
    get model(): Map<string, AbstractModel<any>>;
}
