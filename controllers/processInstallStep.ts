import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {MigrationsHelper} from "../helper/migrationsHelper";

export default async function processMigrations(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	// TODO здесь выполнять processStep
};
