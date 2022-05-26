import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function bindAccessRights() {
    let instances = sails.config.adminpanel.instances;
    for (let key of Object.keys(instances)) {
        let department = `Section ${instances[key].name}`;

        // create
        AccessRightsHelper.registerToken({id: `create-${key}`, name: "Create",
            description: "Access to creating record in database", department: department});

        // read
        AccessRightsHelper.registerToken({id: `read-${key}`, name: "Read",
            description: "Access to reading records in database", department: department});

        // update
        AccessRightsHelper.registerToken({id: `update-${key}`, name: "Update",
            description: "Access to updating records in database", department: department});

        // delete
        AccessRightsHelper.registerToken({id: `delete-${key}`, name: "Delete",
            description: "Access to deleting records in database", department: department});
    }
}
