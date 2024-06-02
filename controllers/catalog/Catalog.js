"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCatalogItems = exports.catalogController = void 0;
const CatalogHandler_1 = require("./CatalogHandler");
async function catalogController(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
    }
    const slug = req.param('slug');
    const method = req.method.toUpperCase();
    if (method === 'GET') {
        return res.viewAdmin('catalog', { entity: "entity", slug: slug });
    }
    if (method === 'POST' || method === 'PUT') {
        const data = req.body;
        const catalog = CatalogHandler_1.CatalogHandler.getCatalog(slug);
        const item = catalog.getItemType(data.type);
        switch (method) {
            case 'POST':
                if (data._method === 'getHTML') {
                    return res.json({ 'data': catalog.getAddHTML(item) });
                }
                else {
                    let result = await catalog.create(item, data.data);
                    return res.json({ 'data': result });
                }
            case 'PUT':
            // return res.json({'data': catalog.getEditHTML(item)})
        }
    }
}
exports.catalogController = catalogController;
async function getCatalogItems(req, res) {
    if (!req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }
    const method = req.method.toUpperCase();
    if (method === 'POST') {
        const body = req.body;
        let catalog = CatalogHandler_1.CatalogHandler.getCatalog(body.slug);
        return res.json({ 'data': catalog.getItems() });
    }
}
exports.getCatalogItems = getCatalogItems;
