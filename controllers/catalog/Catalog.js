"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = exports.catalogController = void 0;
const CatalogHandler_1 = require("./CatalogHandler");
const FrontentCatalogAdapter_1 = require("./FrontentCatalogAdapter");
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
        const _catalog = CatalogHandler_1.CatalogHandler.getCatalog(slug);
        const vueCatalog = new FrontentCatalogAdapter_1.VueCatalog(_catalog);
        if (!vueCatalog)
            return res.status(404);
        vueCatalog.setID(id);
        const item = vueCatalog.getItemType(data.type);
        switch (method) {
            case 'POST':
                switch (data._method) {
                    case 'getHTML':
                        return res.json(vueCatalog.getAddHTML(item));
                    case 'getCatalog':
                        return res.json({
                            'items': vueCatalog.getItems(),
                            'catalog': await vueCatalog.getCatalog()
                        });
                    case 'createItem':
                        return res.json({ 'data': await vueCatalog.createItem(item, data.data) });
                    case 'getChilds':
                        return res.json({ data: await vueCatalog.getChilds(data.data) });
                    case 'getCreatedItems':
                        return res.json({ data: await vueCatalog.getCreatedItems(item) });
                    case 'getActions':
                        return res.json({ data: await vueCatalog.getActions([item]) });
                    case 'search':
                        return res.json({ data: await vueCatalog.search(data.s) });
                }
                break;
            case 'PUT':
                switch (data._method) {
                    case 'sortOrder':
                        return res.json({ data: await vueCatalog.setSortOrder(data.data) });
                    case 'action':
                        return res.json({ data: await vueCatalog.handleAction(data.data.actionID, [item], data.data.config) });
                    case 'updateItem':
                        return res.json({ data: await vueCatalog.updateItem(item, data.id, data.data) });
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
