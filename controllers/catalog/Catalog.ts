import {CatalogHandler} from "./CatalogHandler";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

export async function catalogController(req, res) {
	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		}
	}
	const slug = req.param('slug');
	const method = req.method.toUpperCase();
	if (method === 'GET') {
		return res.viewAdmin('catalog', {entity: "entity", slug: slug});
	}
	if (method === 'POST' || method === 'PUT') {
		const data = req.body
		const catalog = CatalogHandler.getCatalog(slug)
		const item = catalog.getItemType(data.type)
		switch (method) {
			case 'POST':
				if (data._method === 'getHTML') {
					return res.json({'data': catalog.getAddHTML(item)})
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
