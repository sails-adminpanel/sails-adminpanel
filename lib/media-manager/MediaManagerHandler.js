"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManagerHandler = void 0;
class MediaManagerHandler {
    static add(manager) {
        this.managers.push(manager);
    }
    static get(id) {
        return this.managers.find(e => e.id === id);
    }
}
exports.MediaManagerHandler = MediaManagerHandler;
MediaManagerHandler.managers = [];
