"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function bindAccessRights() {
    if (sails.config.adminpanel.entities) {
        let entities = sails.config.adminpanel.entities;
        for (let key of Object.keys(entities)) {
            let department = `Section ${key}`;
            // create
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `create-${key}-entity`, name: "Create",
                description: "Access to creating record in database", department: department });
            // read
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `read-${key}-entity`, name: "Read",
                description: "Access to reading records in database", department: department });
            // update
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `update-${key}-entity`, name: "Update",
                description: "Access to updating records in database", department: department });
            // delete
            accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `delete-${key}-entity`, name: "Delete",
                description: "Access to deleting records in database", department: department });
        }
    }
    if (sails.config.adminpanel.generator && sails.config.adminpanel.generator.forms) {
        let forms = sails.config.adminpanel.generator.forms;
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
}
exports.default = bindAccessRights;
