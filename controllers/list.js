"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = list;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
async function list(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
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
    let dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "list");
    let fields = dataAccessor.getFieldsConfig();
    res.viewAdmin({
        entity: entity,
        fields: fields,
    });
}
