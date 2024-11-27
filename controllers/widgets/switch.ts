import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import SwitchBase from "../../lib/widgets/abstractSwitch";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";

export async function widgetSwitchController(req: ReqType, res: ResType) {
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

	let widget = WidgetHandler.getById(widgetId) as SwitchBase;
	if(widget === undefined){
		return res.notFound()
	}

	/** get state */
	if (req.method.toUpperCase() === 'GET') {
		try{
			let state = await widget.getState();
			return res.json({state: state})
		} catch (e){
			return res.serverError(e)
		}
	}

	/** Switch state  */
	else if (req.method.toUpperCase() === 'POST') {
		try{
			let state = await widget.switchIt();
			return res.json({state: state})
		} catch (e){
			return res.serverError(e)
		}
	}
}
