import {CatalogHandler} from "../../lib/catalog/CatalogHandler";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import {VueCatalog} from "./FrontentCatalogAdapter";


export async function catalogController(req, res) {
	const slug = req.param('slug');
	const id = req.param('id') ? req.param('id') : '';
	const postfix = id ? `${slug}-${id}` : `${slug}`
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}else if (!AccessRightsHelper.havePermission(`catalog-${postfix}`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}
	const method = req.method.toUpperCase();
	if (method === 'GET') {
		return res.viewAdmin('catalog', {entity: "entity", slug: slug, id: id});
	}

	if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
		const data = req.body
		const _catalog = CatalogHandler.getCatalog(slug)
		const vueCatalog = new VueCatalog(_catalog);

		if (!vueCatalog) return res.status(404);

		vueCatalog.setID(id)
		const item = vueCatalog.getItemType(data.type)
		switch (method) {
			case 'POST':
				switch (data._method) {
					case 'getAddHTML':
						return res.json(await vueCatalog.getAddHTML(item))
					case 'getEditHTML':
						return res.json(await vueCatalog.getEditHTML(item, data.id, data.modelId))
					case 'getCatalog':
						const _catalog = await vueCatalog.getCatalog();
						return res.json({
							'items': vueCatalog.getitemTypes(),
							'catalog': {nodes: _catalog},
							'toolsActions': await vueCatalog.getActions([], 'tools')
						})
					case 'createItem':
						return res.json({'data': await vueCatalog.createItem(data.data)})
					case 'getChilds':
						return res.json({data: await vueCatalog.getChilds(data.data)})
					case 'getActions':
						return res.json({data: await vueCatalog.getActions(data.items, data.type)})
					case 'search':
						return res.json({data: await vueCatalog.search(data.s)})
				}
				break;
			case 'PUT':
				switch (data._method) {
					case 'updateTree':
						return res.json({data: await vueCatalog.updateTree(data.data)})
					case 'getLink':
						return res.json({data: await vueCatalog.getLink(data.actionId)})
					case 'handleAction':
						return res.json({data: await vueCatalog.handleAction(data.data.actionID, data.data.items, data.data.config)})
					case 'getPopUpHTML':
						return  res.json({data: await vueCatalog.getPopUpHTML(data.actionId)})
					case 'updateItem':
						return res.json({data: await vueCatalog.updateItem(item, data.modelId, data.data)})
				}
				break
			case 'DELETE':
				return res.json({data: await vueCatalog.deleteItem(data.data)})
		}
	}
}
