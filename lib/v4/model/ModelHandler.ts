import { AbstractModel } from "./AbstractModel";

export class ModelHandler {
    private static models: Map<string, AbstractModel<any>> = new Map();
  
    static registerModel<T>(modelName: string, modelInstance: AbstractModel<T>): void {
        const modelname = modelName.toLowerCase()
        if (this.models.has(modelname)) {
          throw new Error(`Model "${modelname}" is already registered.`);
        }
        this.models.set(modelname, modelInstance);
        adminizer.log.debug(`Model with name [${modelname}] was registred`)
        console.log(`Model with name [${modelname}] was registred`)
        
    }

    static get model() {
        return this.models;
    }
}
