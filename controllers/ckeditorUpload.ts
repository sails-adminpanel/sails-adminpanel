import { AdminUtil } from "../lib/adminUtil";
import { AccessRightsHelper } from "../helper/accessRightsHelper";
import * as path from "path";
import { AdminpanelConfig, BaseFieldConfig } from "../interfaces/adminpanelConfig";

export default function upload(req, res) {

	console.log('admin > CK-upload');
	let entity = AdminUtil.findEntityObject(req);
	console.log(req.session.UserAP);

	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.enoughPermissions([
			`update-${entity.name}-model`,
			`create-${entity.name}-model`,
			`update-${entity.name}-form`,
			`create-${entity.name}-form`
		], req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}
	return res.ok('OK')
}