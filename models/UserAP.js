"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let passwordHash = require('password-hash');
let attributes = {
    id: {
        type: 'number',
        autoIncrement: true
    },
    login: {
        type: 'string',
        required: true,
        unique: true
    },
    fullName: {
        type: 'string',
        required: true
    },
    email: "string",
    passwordHashed: {
        type: 'string'
    },
    timezone: "string",
    expires: "number",
    locale: "string",
    isDeleted: "boolean",
    isActive: "boolean",
    isAdministrator: "boolean",
    groups: {
        collection: "groupap",
        via: "users"
    }
};
let model = {
    beforeCreate: (values, next) => {
        values.passwordHashed = passwordHash.generate(values.fullName + values.password);
        return next();
    }
    /** ... Any model methods here ... */
};
module.exports = {
    primaryKey: "id",
    attributes: attributes,
    ...model,
};
