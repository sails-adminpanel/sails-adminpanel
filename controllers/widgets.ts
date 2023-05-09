import * as fs from "fs";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default function widgets(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`widgets`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}
	return res.json({ widgets: sails.config.adminpanel.widgets });
}
