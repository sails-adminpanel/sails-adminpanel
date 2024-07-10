import { CatalogHandler } from "../../lib/catalog/CatalogHandler";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import { VueCatalog } from "./FrontentCatalogAdapter";



export async function catalogController(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}
	}

	const slug = req.param('slug');
	const id = req.param('id') ? req.param('id') : '';
	const method = req.method.toUpperCase();
	if (method === 'GET') {
		return res.viewAdmin('catalog', {entity: "entity", slug: slug, id: id});
	}

	if (method === 'POST' || method === 'PUT') {
		const data = req.body
		const _catalog = CatalogHandler.getCatalog(slug)
		const vueCatalog = new VueCatalog(_catalog);

		if (!vueCatalog) return res.status(404);

		vueCatalog.setID(id)
		const item = vueCatalog.getItemType(data.type)
		switch (method) {
			case 'POST':
				switch (data._method) {
					case 'getHTML':
						return res.json(vueCatalog.getAddHTML(item))
					case 'getCatalog':
						const _catalog = await vueCatalog.getCatalog();
						return res.json({
							'items': vueCatalog.getitemTypes(),
							'catalog': { nodes: _catalog }
						})
					case 'createItem':
						return res.json({ 'data': await vueCatalog.createItem(data.data) })
					case 'getChilds':
						return res.json({ data: await vueCatalog.getChilds(data.data) })


					/**
					 * Will be moved to the navigation action because it doesn't actually refer to the directory.
					 */
					case 'getCreatedItems':
						// return res.json({ data: await vueCatalog.getCreatedItems(item) })
						return res.json({ data: [] })

					case 'getActions':
						return res.json({ data: await vueCatalog.getActions([item]) })
					case 'search':
						return res.json({ data: await vueCatalog.search(data.s) })
				}
				break;
			case 'PUT':
				switch (data._method) {

					// TODO rename as updateTree
					case 'sortOrder':
						return res.json({ data: await vueCatalog.updateTree(data.data) })
					case 'updateTree':
						return res.json({ data: await vueCatalog.updateTree(data.data) })
					case 'action':
						return res.json({ data: await vueCatalog.handleAction(data.data.actionID, [item], data.data.config) })
					case 'updateItem':
						return res.json({ data: await vueCatalog.updateItem(item, data.id, data.data) })
				}
		}
	}
}

export async function getAction(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}
	}
	const method = req.method.toUpperCase();
	if (method === 'POST') {
		const body = req.body
		const catalog = CatalogHandler.getCatalog(body.slug)
	}
}
