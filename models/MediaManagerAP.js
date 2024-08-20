"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    parent: {
        model: 'MediaManagerAP'
    },
    children: {
        collection: 'MediaManagerAP',
        via: 'parent'
    },
    mimeType: {
        type: 'string'
    },
    path: {
        type: 'string'
    },
    size: {
        type: 'number'
    },
    image_size: {
        type: "json"
    },
    cropType: {
        type: 'string'
    },
    url: {
        type: 'string'
    },
    filename: {
        type: 'string'
    },
    meta: {
        collection: 'MediaManagerMetaAP',
        via: 'parent'
    }
};
const methods = {
    beforeCreate(record, cb) {
        if (!record.id) {
            record.id = (0, uuid_1.v4)();
        }
        cb();
    },
    /** ... Any model methods here ... */
};
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
