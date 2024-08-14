"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    parentId: {
        model: 'MediaManagerAP',
    },
    mimeType: {
        type: 'string'
    },
    size: {
        type: 'string'
    },
    date: {
        type: 'string'
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
