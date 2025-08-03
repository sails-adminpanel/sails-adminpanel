"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: "string",
        required: true,
        unique: true
    },
    tree: {
        type: "json",
        required: true
    }
};
