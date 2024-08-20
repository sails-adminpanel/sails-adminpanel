"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaManagerController = mediaManagerController;
const MediaManagerHandler_1 = require("../../lib/media-manager/MediaManagerHandler");
const mediaManagerAdapter_1 = require("./mediaManagerAdapter");
async function mediaManagerController(req, res) {
    const method = req.method.toUpperCase();
    let id = req.param('id') ? req.param('id') : '';
    if (!id) {
        return res.sendStatus(404);
    }
    const _manager = MediaManagerHandler_1.MediaManagerHandler.get(id);
    const manager = new mediaManagerAdapter_1.MediaManagerAdapter(_manager);
    if (method === 'GET') {
        return await manager.getLibrary(req, res);
    }
    if (method === 'POST') {
        switch (req.body._method) {
            case 'upload':
                return await manager.upload(req, res);
            case 'addMeta':
                return await manager.setMeta(req, res);
            case 'getMeta':
                return await manager.getMeta(req, res);
            case 'cropped':
                return await manager.uploadCropped(req, res);
            case 'getChildren':
                return await manager.getChildren(req, res);
        }
    }
}
