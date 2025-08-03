"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    login: {
        type: "string",
        required: true,
        unique: true
    },
    fullName: {
        type: "string",
        required: true
    },
    email: {
        type: "string"
    },
    avatar: {
        type: "string"
    },
    passwordHashed: {
        type: "string"
    },
    timezone: {
        type: "string"
    },
    expires: {
        type: "string"
    },
    locale: {
        type: "string"
    },
    isDeleted: {
        type: "boolean"
    },
    isActive: {
        type: "boolean"
    },
    isAdministrator: {
        type: "boolean"
    },
    groups: {
        collection: "GroupAP",
        via: "users"
    },
    widgets: {
        type: "json"
    },
    isConfirmed: {
        type: "boolean"
    }
};
