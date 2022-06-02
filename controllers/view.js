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
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.config.view) {
        return res.redirect(instance.uri);
    }
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
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'view');
    let record;
    try {
        record = await instance.model.findOne(req.param('id')).populateAll();
    }
    catch (e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }
    res.viewAdmin({
        instance: instance,
        record: record,
        fields: fields,
        currentUser: req.session.UserAP
    });
}
exports.default = view;
;
