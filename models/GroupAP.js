"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: "string",
        required: true,
        unique: true
    },
    description: {
        type: "string"
    },
    tokens: {
        type: "json"
    },
    users: {
        collection: "UserAP",
        via: "groups"
    }
};
