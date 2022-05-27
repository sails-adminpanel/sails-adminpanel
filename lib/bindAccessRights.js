"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function bindAccessRights() {
    let instances = sails.config.adminpanel.instances;
    for (let key of Object.keys(instances)) {
        let department = `Section ${key}`;
        // create
        accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `create-${key}`, name: "Create",
            description: "Access to creating record in database", department: department });
        // read
        accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `read-${key}`, name: "Read",
            description: "Access to reading records in database", department: department });
        // update
        accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `update-${key}`, name: "Update",
            description: "Access to updating records in database", department: department });
        // delete
        accessRightsHelper_1.AccessRightsHelper.registerToken({ id: `delete-${key}`, name: "Delete",
            description: "Access to deleting records in database", department: department });
    }
}
exports.default = bindAccessRights;
