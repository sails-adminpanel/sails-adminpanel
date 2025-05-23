import { AccessRightsHelper } from "../../helper/accessRightsHelper";
import { MediaManagerHandler } from "../../lib/media-manager/MediaManagerHandler";
import { MediaManagerAdapter } from "./mediaManagerAdapter";

export async function mediaManagerController(req: ReqType, res: ResType) {
	const method = req.method.toUpperCase();
	let id = req.param('id') ? req.param('id') : '';

	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`catalog-${id}`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	if (!id) {
		return res.sendStatus(404)
	}
	const _manager = MediaManagerHandler.get(id)
	const manager = new MediaManagerAdapter(_manager)
	if (method === 'GET') {
		return await manager.get(req, res)
	}

	if (method === 'POST') {
		switch (req.body._method) {
			case 'upload':
				return await manager.upload(req, res)
			case 'addMeta':
				return await manager.setMeta(req, res)
			case 'getMeta':
				return await manager.getMeta(req, res)
			case 'variant':
				return await manager.uploadVariant(req, res)
			case 'getChildren':
				return await manager.getVariants(req, res)
			case 'search':
				return await manager.search(req, res)
		}
	}
	if (method === 'DELETE') {
		return await manager.delete(req, res)
	}
}
