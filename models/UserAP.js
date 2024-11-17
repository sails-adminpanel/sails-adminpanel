"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_hash_1 = require("password-hash");
const attributes = {
    id: {
        type: 'number',
        autoIncrement: true,
    },
    login: {
        type: 'string',
        required: true,
        unique: true,
    },
    fullName: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
    },
    passwordHashed: {
        type: 'string',
    },
    password: {
        type: 'string',
    },
    timezone: {
        type: 'string',
    },
    expires: {
        type: 'string',
    },
    locale: {
        type: 'string',
    },
    isDeleted: {
        type: 'boolean',
    },
    isActive: {
        type: 'boolean',
    },
    isAdministrator: {
        type: 'boolean',
    },
    groups: {
        collection: 'GroupAP',
        via: 'users',
    },
    widgets: {
        type: 'json',
    },
    isConfirmed: {
        type: 'boolean',
    }
};
// Методы модели
const methods = {
    beforeCreate(values, cb) {
        values.passwordHashed = (0, password_hash_1.generate)(values.login + values.password);
        values.password = 'masked';
        cb();
    },
    beforeUpdate(values, cb) {
        if (values.password) {
            values.passwordHashed = (0, password_hash_1.generate)(values.login + values.password);
            values.password = 'masked';
        }
        cb();
    },
    /** ... Any additional model methods ... */
};
// Модель
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
