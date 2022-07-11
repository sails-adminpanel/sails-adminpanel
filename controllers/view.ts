import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function view(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }

    let entity = AdminUtil.findEntityObject(req);
    if (!entity.config.view) {
        return res.redirect(entity.uri);
    }

    if (!entity.model) {
        return res.notFound();
    }

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`read-${entity.name}-entity`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let fields = FieldsHelper.getFields(req, entity, 'view');

    let record;
    try {
        record = await entity.model.findOne(req.param('id')).populateAll();
    } catch (e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }

    res.viewAdmin({
        entity: entity,
        record: record,
        fields: fields
    });
};
