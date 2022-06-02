import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

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

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`read-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let fields = FieldsHelper.getFields(req, instance, 'view');

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
        fields: fields,
        currentUser: req.session.UserAP
    });
};
