import {AdminUtil} from "../../lib/adminUtil";
import {DataAccessor} from "../../lib/v4/DataAccessor";

export default async function edit(req: ReqTypeAP, res: ResTypeAP) {
	if (adminizer.config.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
		}
	}

	let entity = AdminUtil.findEntityObject(req);
	let dataAccessor = new DataAccessor(req.session.UserAP, entity, "edit");
	let record: any = await entity.model._findOne(req.param('id'), dataAccessor);
	return res.redirect(`/admin/catalog/navigation/${record.label}`)
}
