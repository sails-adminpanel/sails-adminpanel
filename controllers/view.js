"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function view(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (!entity.config.view) {
        return res.redirect(entity.uri);
    }
    if (!entity.model) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, entity, 'view');
    let record;
    try {
        record = await entity.model.findOne(req.param('id')).populateAll();
    }
    catch (e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }
    res.viewAdmin({
        entity: entity,
        record: record,
        fields: fields
    });
}
exports.default = view;
;
