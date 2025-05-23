import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import ActionBase from "../../lib/widgets/abstractAction";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";

export async function widgetActionController(req: ReqType, res: ResType) {
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

	else if (req.method.toUpperCase() === 'POST') {
		try {
			await widget.action();
			return res.json({ok: true})
		} catch (error) {
			return res.json(error)
		}
	}
}
