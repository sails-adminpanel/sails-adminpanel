import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {DataAccessor} from "../lib/v4/DataAccessor";

export default async function view(req: ReqType, res: ResType) {
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

    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let dataAccessor = new DataAccessor(req.session.UserAP, entity, "view");
    let fields = dataAccessor.getFieldsConfig();

    let record;
    try {
        record = await entity.model._findOne(req.param('id'), dataAccessor);
    } catch (e) {
        adminizer.log.error('Admin edit error: ');
        adminizer.log.error(e);
        return res.serverError();
    }

    res.viewAdmin({
        entity: entity,
        record: record,
        fields: fields
    });
};
