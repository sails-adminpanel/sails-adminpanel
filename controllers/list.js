"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function list(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'list');
    res.viewAdmin({
        instance: instance,
        fields: fields,
        config: sails.adminpanel
    });
}
exports.default = list;
;
