import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function list(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
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

    let fields = FieldsHelper.getFields(req, instance, 'list');

    res.viewAdmin({
        instance: instance,
        fields: fields,
        config: sails.adminpanel
    });

};
