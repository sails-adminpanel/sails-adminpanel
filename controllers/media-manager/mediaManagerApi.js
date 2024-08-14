"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaManagerController = mediaManagerController;
const MediaManagerHandler_1 = require("../../lib/media-manager/MediaManagerHandler");
async function mediaManagerController(req, res) {
    const method = req.method.toUpperCase();
    let id = req.param('id') ? req.param('id') : '';
    if (!id) {
        return res.sendStatus(404);
    }
    const manager = MediaManagerHandler_1.MediaManagerHandler.get(id);
    if (method === 'POST') {
        return manager.upload(req, res);
    }
}
