"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelHandler = void 0;
class ModelHandler {
    static registerModel(modelName, modelInstance) {
        const modelname = modelName.toLowerCase();
        if (this.models.has(modelname)) {
            throw new Error(`Model "${modelname}" is already registered.`);
        }
        this.models.set(modelname, modelInstance);
        sails.log.debug(`Model with name [${modelname}] was registred`);
        console.log(`Model with name [${modelname}] was registred`);
    }
    static get model() {
        return this.models;
    }
}
exports.ModelHandler = ModelHandler;
ModelHandler.models = new Map();
