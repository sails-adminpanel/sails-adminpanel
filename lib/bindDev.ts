export default function bindDev(adminpanelConfig) {
    if (adminpanelConfig.instances) {
        Object.keys(sails.models).forEach((modelname) => {
            let modelName = sails.models[modelname].globalId;
            adminpanelConfig.instances[`dev-${modelName}`] = {
                title: `dev-${modelName}`,
                model: modelName,
                icon: "cube"
            };
        });
    }
}
