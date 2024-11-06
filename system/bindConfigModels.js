"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindConfigModels;
const waterline_1 = require("../lib/v4/model/adapter/waterline");
const ModelHandler_1 = require("../lib/v4/model/ModelHandler");
function bindConfigModels(adminpanelConfig) {
    let models = Object.values(adminpanelConfig.models)
        .filter((item) => typeof item !== 'boolean' && item?.model !== undefined)
        .map(item => item.model);
    models = models.concat([
        'GroupAP',
        'MediaManagerAP',
        'MediaManagerAssociationsAP',
        'MediaManagerMetaAP',
        'NavigationAP',
        'UserAP'
    ]);
    models = [...new Set(models.map(modelname => modelname.toLowerCase()))];
    models.forEach((modelname) => {
        const model = sails.models[modelname];
        const modelName = model.globalId;
        const waterlineModel = new waterline_1.Waterline(modelName, model);
        ModelHandler_1.ModelHandler.registerModel(modelName, waterlineModel);
    });
}
