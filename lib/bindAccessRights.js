"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function bindAccessRights() {
    if (sails.config.adminpanel.models) {
        let entities = sails.config.adminpanel.models;
        for (let key of Object.keys(entities)) {
            let department = `Model ${key}`;
            // create
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `create-${key}-model`, name: "Create",
                description: "Access to creating record in database", department: department });
            // read
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `read-${key}-model`, name: "Read",
                description: "Access to reading records in database", department: department });
            // update
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `update-${key}-model`, name: "Update",
                description: "Access to updating records in database", department: department });
            // delete
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `delete-${key}-model`, name: "Delete",
                description: "Access to deleting records in database", department: department });
        }
    }
    if (sails.config.adminpanel.forms && sails.config.adminpanel.forms.data) {
        let forms = sails.config.adminpanel.forms.data;
        for (let key of Object.keys(forms)) {
            let department = `Form ${key}`;
            // create
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `create-${key}-form`, name: "Create",
                description: "Access to creating form in database", department: department });
            // read
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `read-${key}-form`, name: "Read",
                description: "Access to reading form in database", department: department });
            // update
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `update-${key}-form`, name: "Update",
                description: "Access to updating form in database", department: department });
            // delete
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `delete-${key}-form`, name: "Delete",
                description: "Access to deleting form in database", department: department });
        }
    }
    accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `migrations`, name: "Migrations",
        description: "Access to '/migrations' route", department: "Routes" });
    accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `process-migrations`, name: "Process migrations",
        description: "Access to '/processMigrations' route", department: "Routes" });
    accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `widgets`, name: "Widgets",
        description: "Access to '/widgets-get-all' route", department: "Routes" });
}
exports.default = bindAccessRights;
