import {AdminUtil} from "../../lib/adminUtil";
import {DataAccessor} from "../../lib/v4/DataAccessor";

export default async function edit(req: ReqType, res: ResType) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}
	}

	let entity = AdminUtil.findEntityObject(req);
	let dataAccessor = new DataAccessor(req.session.UserAP, entity, "edit");
	let record: any = await entity.model._findOne(req.param('id'), dataAccessor);
	return res.redirect(`/admin/catalog/navigation/${record.label}`)
}
