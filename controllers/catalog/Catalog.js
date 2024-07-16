"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = exports.catalogController = void 0;
const CatalogHandler_1 = require("../../lib/catalog/CatalogHandler");
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
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
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
                    case 'getAddHTML':
                        return res.json(vueCatalog.getAddHTML(item));
                    case 'getEditHTML':
                        return res.json(await vueCatalog.getEditHTML(item, data.id));
                    case 'getCatalog':
                        const _catalog = await vueCatalog.getCatalog();
                        return res.json({
                            'items': vueCatalog.getitemTypes(),
                            'catalog': { nodes: _catalog },
                            'toolsActions': await vueCatalog.getActions([], 'tools')
                        });
                    case 'createItem':
                        return res.json({ 'data': await vueCatalog.createItem(data.data) });
                    case 'getChilds':
                        return res.json({ data: await vueCatalog.getChilds(data.data) });
                    /**
                     * Will be moved to the navigation action because it doesn't actually refer to the directory.
                     */
                    case 'getCreatedItems':
                        // return res.json({ data: await vueCatalog.getCreatedItems(item) })
                        return res.json({ data: [] });
                    case 'getActions':
                        return res.json({ data: await vueCatalog.getActions(data.items, data.type) });
                    case 'search':
                        return res.json({ data: await vueCatalog.search(data.s) });
                }
                break;
            case 'PUT':
                switch (data._method) {
                    case 'updateTree':
                        return res.json({ data: await vueCatalog.updateTree(data.data) });
                    case 'getLink':
                        return res.json({ data: await vueCatalog.getLink(data.actionId) });
                    case 'handleAction':
                        return res.json({ data: await vueCatalog.handleAction(data.data.actionID, data.data.items, data.data.config) });
                    case 'getPopUpHTML':
                        return res.json({ data: await vueCatalog.getPopUpHTML(data.actionId) });
                    case 'updateItem':
                        return res.json({ data: await vueCatalog.updateItem(item, data.id, data.data) });
                }
                break;
            case 'DELETE':
                return res.json({ data: await vueCatalog.deleteItem(data.data) });
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
