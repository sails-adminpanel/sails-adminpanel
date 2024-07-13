import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function bindAccessRights() {
    if (sails.config.adminpanel.models) {
        let models = sails.config.adminpanel.models;
        for (let key of Object.keys(models)) {
            const model = models[key];
            if(typeof model !== "boolean") {
                let modelName = model.model;
                let department = `Model ${key}`;
    
                // create
                AccessRightsHelper.registerToken({id: `create-${modelName}-model`, name: "Create",
                    description: "Access to creating record in database", department: department});
    
                // read
                AccessRightsHelper.registerToken({id: `read-${modelName}-model`, name: "Read",
                    description: "Access to reading records in database", department: department});
    
                // update
                AccessRightsHelper.registerToken({id: `update-${modelName}-model`, name: "Update",
                    description: "Access to updating records in database", department: department});
    
                // delete
                AccessRightsHelper.registerToken({id: `delete-${modelName}-model`, name: "Delete",
                    description: "Access to deleting records in database", department: department});
            }
        }
    }

    if (sails.config.adminpanel.forms && sails.config.adminpanel.forms.data) {
        let forms = sails.config.adminpanel.forms.data;
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

	AccessRightsHelper.registerToken({id: `process-install-step`, name: "Process install step",
		description: "Access to '/processInstallStep' route", department: "Routes"});

	// Widgets
	AccessRightsHelper.registerToken({id: `widgets`, name: "Widgets",
		description: "Access to widgets", department: "Widgets"});
}
