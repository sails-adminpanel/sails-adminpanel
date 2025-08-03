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
    parent: {
        model: "MediaManagerAP"
    },
    variants: {
        collection: "MediaManagerAP",
        via: "parent"
    },
    mimeType: {
        type: "string"
    },
    path: {
        type: "string"
    },
    size: {
        type: "number"
    },
    group: {
        type: "string"
    },
    tag: {
        type: "string"
    },
    url: {
        type: "string"
    },
    filename: {
        type: "string"
    },
    meta: {
        collection: "MediaManagerMetaAP",
        via: "parent"
    },
    modelAssociation: {
        collection: "MediaManagerAssociationsAP",
        via: "file"
    }
};
