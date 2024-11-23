import { WidgetHandler } from '../lib/widgets/widgetHandler'
import * as fs from "fs";
import * as path from "path"
export default async function bindDashboardWidgets() {
    if (adminizer.config.dashboard && typeof adminizer.config.dashboard !== "boolean" && adminizer.config.dashboard.autoloadWidgetsPath) {
        try {
            const files = fs.readdirSync(adminizer.config.dashboard.autoloadWidgetsPath);

            const jsFiles = files.filter(file => file.endsWith('.js'));

            for (const file of jsFiles) {
                const filePath = path.join(process.cwd(),adminizer.config.dashboard.autoloadWidgetsPath, file);
                try {
                    const _import = require(filePath);
                    if(_import.default) {
                        const ImportedClass = _import.default;
                        const instance = new ImportedClass();
                        WidgetHandler.add(instance);
                    }
                } catch (error) {
                    adminizer.log.error(`Error when connecting and creating an instance of a class from a file ${filePath}:`, error);
                }
            }
        } catch (err) {
            adminizer.log.error('Error reading folder:', err);
        }
    }
}
