"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = view;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
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
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "view");
    let fields = dataAccessor.getFieldsConfig();
    let record;
    try {
        record = await entity.model._findOne(req.param('id'), dataAccessor);
    }
    catch (e) {
        sails.log.error('Admin edit error: ');
        sails.log.error(e);
        return res.serverError();
    }
    res.viewAdmin({
        entity: entity,
        record: record,
        fields: fields
    });
}
;
