import { AdminpanelConfig } from "../interfaces/adminpanelConfig";
export default function bindDev(adminpanelConfig: AdminpanelConfig) {
    if (adminpanelConfig.models) {
        Object.keys(sails.models).forEach((modelname) => {
            let modelName = sails.models[modelname].globalId;
            adminpanelConfig.models[`dev-${modelName}`] = {
                title: `dev-${modelName}`,
                model: modelName,
                icon: "cube"
            };
        });
    }
}
