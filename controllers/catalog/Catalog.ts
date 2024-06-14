import {CatalogHandler} from "./CatalogHandler";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

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
		const catalog = CatalogHandler.getCatalog(slug)
		catalog.setID(id)
		const item = catalog.getItemType(data.type)
		switch (method) {
			case 'POST':
				if (data._method === 'getHTML') {
					return res.json(catalog.getAddHTML(item))
				} else if (data._method === 'createCatalog') {
					return res.json({
						'items': catalog.getItems(),
						'catalog': await catalog.create()
					})
				} else {
					let result = await catalog.createItem(item, data.data)
					return res.json({'nodes': result})
				}
			case 'PUT':
			// return res.json({'data': catalog.getEditHTML(item)})
		}
	}
}

export async function getCatalog(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}
	}
	const method = req.method.toUpperCase();
	if (method === 'POST') {
		const body = req.body
		try {
			const catalog = CatalogHandler.getCatalog(body.slug)
			catalog.setID(body.id)
			if(catalog) {
				const items = catalog.getItems()

				return res.json({
					'items': items,
					'catalog': await catalog.getCatalog()
				})
			} else {
				return res.json({'error': true, 'message': 'No catalog found'})
			}
		} catch (e){
			return e
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
