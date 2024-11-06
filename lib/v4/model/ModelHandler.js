"use strict";
class ModelHandler {
    constructor() {
        this.models = new Map();
    }
    registerModel(modelName, modelInstance) {
        if (this.models.has(modelName)) {
            throw new Error(`Model "${modelName}" is already registered.`);
        }
        this.models.set(modelName, modelInstance);
    }
    get model() {
        return this.models;
    }
}
