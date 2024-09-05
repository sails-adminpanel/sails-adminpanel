"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    /** тут это не надо хранить так как эта модель только для дефолтного */
    mediaManagerId: {
        type: 'string'
    },
    model: {
        type: 'json'
    },
    modelId: {
        type: 'json'
    },
    sortOrder: {
        type: 'number'
    },
    file: {
        model: 'MediaManagerAP'
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
