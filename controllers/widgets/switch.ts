import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import SwitchBase from "../../lib/widgets/abstractSwitch";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";

export async function widgetSwitchController(req, res) {
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

	let widget = WidgetHandler.getById(widgetId) as SwitchBase;
	if(widget === undefined){
		return  res.notFound()
	}

	/** get state */
	if (req.method.toUpperCase() === 'GET') {
		return widget.getState(req, res);
	}

	/** Switch state  */
	else if (req.method.toUpperCase() === 'POST') {
		return widget.switchIt(req, res);
	}
}
