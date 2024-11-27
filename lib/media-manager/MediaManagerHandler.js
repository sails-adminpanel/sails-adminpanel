"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManagerHandler = void 0;
class MediaManagerHandler {
    static add(manager) {
        this.managers.push(manager);
    }
    static get(id) {
        let instance = this.managers.find(e => e.id === id);
        /**
         * ✨ We magically get one
         */
        if (!instance && (id === 'default' || id === undefined) && this.managers.length === 1) {
            instance = this.managers[0];
        }
        if (!instance) {
            adminizer.log.debug(`MediaManager list ${JSON.stringify(this.managers, null, 2)}`);
            throw `MediaManager with id ${id} not found`;
        }
        adminizer.log.debug(`ins`, instance);
        return instance;
    }
}
exports.MediaManagerHandler = MediaManagerHandler;
MediaManagerHandler.managers = [];
