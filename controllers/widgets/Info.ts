import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";
import InfoBase from "../../lib/widgets/abstractInfo";

export async function widgetInfoController(req: ReqTypeAP, res: ResTypeAP) {
	let widgetId = req.param('widgetId');
	if (!widgetId) {
		return res.notFound();
	}

	if (adminizer.config.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`widget-${widgetId}`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	let widget = WidgetHandler.getById(widgetId) as InfoBase;
	if (widget === undefined) {
		return res.notFound()
	}

	/** get state */
	if (req.method.toUpperCase() === 'GET') {
		try {
			let text = await widget.getInfo();
			return res.send(text)
		} catch (e) {
			return res.serverError(e)
		}
	}
}
