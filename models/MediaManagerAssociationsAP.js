"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: {
        type: "string",
        allowNull: false,
        uuid: true,
        primaryKey: true,
        required: true
    },
    mediaManagerId: {
        type: "string"
    },
    model: {
        type: "json"
    },
    modelId: {
        type: "json"
    },
    widgetName: {
        type: "string"
    },
    sortOrder: {
        type: "number"
    },
    file: {
        model: "MediaManagerAP"
    }
};
