import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function list(req, res) {
    let entity = AdminUtil.findEntityObject(req);
    if (!entity.model) {
        return res.notFound();
    }

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let fields = FieldsHelper.getFields(req, entity, 'list');

    res.viewAdmin({
        entity: entity,
        fields: fields,
        config: sails.adminpanel
    });

};
