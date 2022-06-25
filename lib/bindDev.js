"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bindDev(adminpanelConfig) {
    Object.keys(sails.models).forEach((modelname) => {
        let modelName = sails.models[modelname].globalId;
        adminpanelConfig.instances[`dev-${modelName}`] = {
            title: `dev-${modelName}`,
            model: modelName,
            icon: "cube"
        };
    });
}
exports.default = bindDev;
