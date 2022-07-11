"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bindDev(adminpanelConfig) {
    if (adminpanelConfig.entities) {
        Object.keys(sails.models).forEach((modelname) => {
            let modelName = sails.models[modelname].globalId;
            adminpanelConfig.entities[`dev-${modelName}`] = {
                title: `dev-${modelName}`,
                model: modelName,
                icon: "cube"
            };
        });
    }
}
exports.default = bindDev;
