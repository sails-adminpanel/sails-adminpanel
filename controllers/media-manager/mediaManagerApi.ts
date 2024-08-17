import {MediaManagerHandler} from "../../lib/media-manager/MediaManagerHandler";

export async function mediaManagerController(req: ReqType, res: ResType) {
	const method = req.method.toUpperCase();
	let id = req.param('id') ? req.param('id') : '';

	if (!id) {
		return res.sendStatus(404)
	}

	const manager = MediaManagerHandler.get(id)

	if (method === 'GET') {
		return await manager.getLibrary(req, res)
	}

	if (method === 'POST') {
		switch (req.body._method) {
			case 'upload':
				return await manager.upload(req, res)
			case 'addMeta':
				return await manager.setMeta(req, res)
			case 'getMeta':
				return await manager.getMeta(req, res)
		}
	}
}
