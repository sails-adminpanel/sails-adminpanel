"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
const adminUtil_1 = require("../../lib/adminUtil");
const DataAccessor_1 = require("../../lib/v4/DataAccessor");
async function edit(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
    }
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    let dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "edit");
    let record = await entity.model._findOne(req.param('id'), dataAccessor);
    return res.redirect(`/admin/catalog/navigation/${record.label}`);
}
