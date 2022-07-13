"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetHelper = void 0;
class WidgetHelper {
    static async editNavigationConfigNormalize(_config) {
        let config = { ..._config };
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
exports.WidgetHelper = WidgetHelper;
