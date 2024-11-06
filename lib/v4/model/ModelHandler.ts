class ModelHandler {
    private models: Map<string, AbstractModel<any>> = new Map();
  
    registerModel<T>(modelName: string, modelInstance: AbstractModel<T>): void {
        if (this.models.has(modelName)) {
          throw new Error(`Model "${modelName}" is already registered.`);
        }
        this.models.set(modelName, modelInstance);
    }

    get model() {
        return this.models;
    }
}