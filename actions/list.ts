import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";

export default async function list(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    //Limit check
    if (typeof instance.config.list.limit !== "number") {
        req._sails.log.error('Admin list error: limit option should be a number. Received: ', instance.config.list.limit);
        instance.config.list.limit = 15;
    }

    //Check page
    let page = req.param('page') || 1;
    if (isFinite(page)) {
        page = parseInt(page) || 1;
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
