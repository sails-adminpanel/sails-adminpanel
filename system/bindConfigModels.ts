import { Waterline } from "../lib/v4/model/adapter/waterline";
import { AdminpanelConfig, ModelConfig } from "../interfaces/adminpanelConfig";
import { ModelHandler } from "../lib/v4/model/ModelHandler";

export default function bindConfigModels(adminpanelConfig: AdminpanelConfig) {
    let models = Object.values(adminpanelConfig.models)
        .filter((item): item is ModelConfig => typeof item !== 'boolean' && item?.model !== undefined)
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

        const waterlineModel = new Waterline(modelName, model);
        ModelHandler.registerModel(modelName, waterlineModel);
    });
}
