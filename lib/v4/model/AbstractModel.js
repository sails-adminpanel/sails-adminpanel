"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
class AbstractModel {
    constructor(modelname, attributes, primaryKey, identity) {
        this.modelname = modelname;
        this.attributes = attributes;
        this.primaryKey = primaryKey;
        this.identity = identity;
    }
}
exports.AbstractModel = AbstractModel;
