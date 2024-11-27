"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaManagerController = mediaManagerController;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const MediaManagerHandler_1 = require("../../lib/media-manager/MediaManagerHandler");
const mediaManagerAdapter_1 = require("./mediaManagerAdapter");
async function mediaManagerController(req, res) {
    const method = req.method.toUpperCase();
    let id = req.param('id') ? req.param('id') : '';
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`catalog-${id}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    if (!id) {
        return res.sendStatus(404);
    }
    const _manager = MediaManagerHandler_1.MediaManagerHandler.get(id);
    const manager = new mediaManagerAdapter_1.MediaManagerAdapter(_manager);
    if (method === 'GET') {
        return await manager.get(req, res);
    }
    if (method === 'POST') {
        switch (req.body._method) {
            case 'upload':
                return await manager.upload(req, res);
            case 'addMeta':
                return await manager.setMeta(req, res);
            case 'getMeta':
                return await manager.getMeta(req, res);
            case 'variant':
                return await manager.uploadVariant(req, res);
            case 'getChildren':
                return await manager.getVariants(req, res);
            case 'search':
                return await manager.search(req, res);
        }
    }
    if (method === 'DELETE') {
        return await manager.delete(req, res);
    }
}
