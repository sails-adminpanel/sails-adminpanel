"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
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
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'view');
    if (!sails.adminpanel.havePermission(req, instance.config, __filename)) {
        return res.redirect('/admin/userap/login');
    }
    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }
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
        fields: fields
    });
}
exports.default = view;
;
