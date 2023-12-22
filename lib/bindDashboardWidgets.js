"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widgetHandler_1 = require("./widgets/widgetHandler");
const fs = require("fs");
const path = require("path");
async function bindDashboardWidgets() {
    if (sails.config.adminpanel.dashboard && typeof sails.config.adminpanel.dashboard !== "boolean" && sails.config.adminpanel.dashboard.autoloadWidgetsPath) {
        try {
            const files = fs.readdirSync(sails.config.adminpanel.dashboard.autoloadWidgetsPath);
            const jsFiles = files.filter(file => file.endsWith('.js'));
            for (const file of jsFiles) {
                const filePath = path.join(process.cwd(), sails.config.adminpanel.dashboard.autoloadWidgetsPath, file);
                try {
                    const _import = require(filePath);
                    if (_import.default) {
                        const ImportedClass = _import.default;
                        const instance = new ImportedClass();
                        widgetHandler_1.WidgetHandler.add(instance);
                    }
                }
                catch (error) {
                    console.error(`Error when connecting and creating an instance of a class from a file ${filePath}:`, error);
                }
            }
        }
        catch (err) {
            console.error('Error reading folder:', err);
        }
    }
}
exports.default = bindDashboardWidgets;
