import {NavigationOptionsField} from "../interfaces/adminpanelConfig";

export class WidgetHelper {
    public static async editNavigationConfigNormalize(_config: NavigationOptionsField) {
        let config = {..._config}
        for (let [key, value] of Object.entries(config.propertyList)) {
            if (value.type === 'select' && value.options && typeof value.options === "function") {
                let selectOptions = await value.options();
                if (selectOptions.length) {
                    config.propertyList[key].options = selectOptions;
                }
            }
        }
        return config;
    }
}
