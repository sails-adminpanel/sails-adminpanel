import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";

export default async function list(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    if (!sails.adminpanel.havePermission(req, instance.config, __filename)) {
        return res.redirect('/admin/userap/login');
    }

    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }

    let fields = FieldsHelper.getFields(req, instance, 'list');

    res.viewAdmin({
        instance: instance,
        fields: fields,
        config: sails.adminpanel
    });

};
