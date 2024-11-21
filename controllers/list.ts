import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import { AccessRightsHelper } from "../helper/accessRightsHelper";
import {DataAccessor} from "../lib/v4/DataAccessor";

export default async function list(req: ReqType, res: ResType) {
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

  let dataAccessor = new DataAccessor(req.session.UserAP, entity, "list");
  let fields = dataAccessor.getFieldsConfig();

  res.viewAdmin({
    entity: entity,
    fields: fields,
  });
}
