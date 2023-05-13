import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";
import InfoBase from "../../lib/widgets/abstractInfo";

export async function widgetInfoController(req, res) {
	let widgetId = req.param('widgetId');
	if (!widgetId) {
		return res.notFound();
	}

	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`widget-${widgetId}`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	let widget = WidgetHandler.getById(widgetId) as InfoBase;
	if(widget === undefined){
		return  res.notFound()
	}

	/** get state */
	if (req.method.toUpperCase() === 'GET') {
		let text = await widget.getInfo();
		return res.json({text: text})
	}
}
