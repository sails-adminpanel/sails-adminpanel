"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    label: {
        type: "string",
        required: true,
    },
    tree: {
        type: "json",
        required: true,
    },
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
