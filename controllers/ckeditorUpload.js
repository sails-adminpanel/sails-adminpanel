"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function upload(req, res) {
    console.log('admin > CK-upload');
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    console.log(req.session.UserAP);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.enoughPermissions([
            `update-${entity.name}-model`,
            `create-${entity.name}-model`,
            `update-${entity.name}-form`,
            `create-${entity.name}-form`
        ], req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    return res.ok('OK');
}
exports.default = upload;
