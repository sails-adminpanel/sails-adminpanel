"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attributes = {
    id: {
        type: "number",
        autoIncrement: true,
    },
    name: {
        type: "string",
        required: true,
        unique: true,
    },
    description: {
        type: "string",
    },
    tokens: {
        type: "json",
    },
    users: {
        collection: "UserAP",
        via: "groups",
    },
};
const methods = {
    beforeCreate(record, cb) {
        cb();
    },
};
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
