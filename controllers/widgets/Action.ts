import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import ActionBase from "../../lib/widgets/abstractAction";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";

export async function widgetActionController(req, res) {
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

	let widget = WidgetHandler.getById(widgetId) as ActionBase;
	if(widget === undefined){
		return res.notFound()
	}

	/** Switch state  */
	else if (req.method.toUpperCase() === 'POST') {
		let state = await widget.action();
		if(state){
			return res.json({ok: state})
		}else {
			return res.serverError('Error')
		}
	}
}