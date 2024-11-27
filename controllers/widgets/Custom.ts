import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import CustomBase from "../../lib/widgets/abstractCustom";
import {WidgetHandler} from "../../lib/widgets/widgetHandler";

export async function widgetCustomController(req: ReqType, res: ResType) {
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

	let widget = WidgetHandler.getById(widgetId) as CustomBase;
	if(widget === undefined){
		return res.notFound()
	}

	// /** get state */
	// if (req.method.toUpperCase() === 'GET') {
	// 	try{
	// 		let state = await widget.getState();
	// 		return res.json({state: state})
	// 	} catch (e){
	// 		return res.serverError(e)
	// 	}
	// }

	// /** Custom state  */
	// else if (req.method.toUpperCase() === 'POST') {
	// 	try{
	// 		let state = await widget.addOne();
	// 		return res.json({state: state})
	// 	} catch (e){
	// 		return res.serverError(e)
	// 	}
	// }
}
