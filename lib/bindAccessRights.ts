import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function bindAccessRights() {
    if (sails.config.adminpanel.entities) {
        let entities = sails.config.adminpanel.entities;
        for (let key of Object.keys(entities)) {
            let department = `Section ${key}`;

            // create
            AccessRightsHelper.registerToken({id: `create-${key}-entity`, name: "Create",
                description: "Access to creating record in database", department: department});

            // read
            AccessRightsHelper.registerToken({id: `read-${key}-entity`, name: "Read",
                description: "Access to reading records in database", department: department});

            // update
            AccessRightsHelper.registerToken({id: `update-${key}-entity`, name: "Update",
                description: "Access to updating records in database", department: department});

            // delete
            AccessRightsHelper.registerToken({id: `delete-${key}-entity`, name: "Delete",
                description: "Access to deleting records in database", department: department});
        }
    }

    if (sails.config.adminpanel.generator && sails.config.adminpanel.generator.forms) {
        let forms = sails.config.adminpanel.generator.forms;
        for (let key of Object.keys(forms)) {
            let department = `Form ${key}`;

            // create
            AccessRightsHelper.registerToken({id: `create-${key}-form`, name: "Create",
                description: "Access to creating form in database", department: department});

            // read
            AccessRightsHelper.registerToken({id: `read-${key}-form`, name: "Read",
                description: "Access to reading form in database", department: department});

            // update
            AccessRightsHelper.registerToken({id: `update-${key}-form`, name: "Update",
                description: "Access to updating form in database", department: department});

            // delete
            AccessRightsHelper.registerToken({id: `delete-${key}-form`, name: "Delete",
                description: "Access to deleting form in database", department: department});
        }
    }
}
