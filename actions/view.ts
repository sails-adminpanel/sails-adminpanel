import { AdminUtil } from "../lib/adminUtil";
let fieldsHelper = require('../helper/fieldsHelper');

export default async function view(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }

    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.config.view) {
        return res.redirect(instance.uri);
    }

    if (!instance.model) {
        return res.notFound();
    }

    let fields = fieldsHelper.getFields(req, instance, 'view');

    if (!sails.adminpanel.havePermission(req, instance.config, __filename)) {
        return res.redirect('/admin/userap/login');
    }

    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }

    let record;
    try {
        record = await instance.model.findOne(req.param('id')).populateAll();
    } catch (e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }

    res.viewAdmin({
        instance: instance,
        record: record,
        fields: fields
    });
};
