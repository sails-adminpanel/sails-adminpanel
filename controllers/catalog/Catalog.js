"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = exports.catalogController = void 0;
const CatalogHandler_1 = require("./CatalogHandler");
async function catalogController(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
    }
    const slug = req.param('slug');
    const id = req.param('id') ? req.param('id') : '';
    const method = req.method.toUpperCase();
    if (method === 'GET') {
        return res.viewAdmin('catalog', { entity: "entity", slug: slug, id: id });
    }
    if (method === 'POST' || method === 'PUT') {
        const data = req.body;
        const catalog = CatalogHandler_1.CatalogHandler.getCatalog(slug);
        if (!catalog)
            return res.status(404);
        catalog.setID(id);
        const item = catalog.getItemType(data.type);
        switch (method) {
            case 'POST':
                switch (data._method) {
                    case 'getHTML':
                        return res.json(catalog.getAddHTML(item));
                    case 'getCatalog':
                        return res.json({
                            'items': catalog.getItems(),
                            'catalog': await catalog.getCatalog()
                        });
                    case 'createItem':
                        return res.json({ 'data': await catalog.createItem(item, data.data) });
                    case 'getChilds':
                        return res.json({ data: await catalog.getChilds(data.data) });
                    case 'getCreatedItems':
                        return res.json({ data: await catalog.getCreatedItems(item) });
                    case 'getActions':
                        return res.json({ data: await catalog.getActions([item]) });
                    case 'search':
                        return res.json({ data: await catalog.search(data.s) });
                }
                break;
            case 'PUT':
                switch (data._method) {
                    case 'sortOrder':
                        return res.json({ data: await catalog.setSortOrder(data.data) });
                    case 'action':
                        return res.json({ data: await catalog.handleAction(data.data.actionID, [item], data.data.config) });
                    case 'updateItem':
                        return res.json({ data: await catalog.updateItem(item, data.id, data.data) });
                }
        }
    }
}
exports.catalogController = catalogController;
async function getAction(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
    }
    const method = req.method.toUpperCase();
    if (method === 'POST') {
        const body = req.body;
        const catalog = CatalogHandler_1.CatalogHandler.getCatalog(body.slug);
    }
}
exports.getAction = getAction;
