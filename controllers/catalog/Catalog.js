"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogController = void 0;
const CatalogHandler_1 = require("../../lib/catalog/CatalogHandler");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
const FrontentCatalogAdapter_1 = require("./FrontentCatalogAdapter");
async function catalogController(req, res) {
    const slug = req.param('slug');
    let id = req.param('id') ? req.param('id') : '';
    const postfix = id ? `${slug}-${id}` : `${slug}`;
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`catalog-${postfix}`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    const _catalog = CatalogHandler_1.CatalogHandler.getCatalog(slug);
    if (_catalog === undefined)
        return res.sendStatus(404);
    const idList = await _catalog.getIdList();
    if (id) {
        if (idList.length && !idList.includes(id)) {
            return res.sendStatus(404);
        }
    }
    else {
        if (idList.length) {
            id = idList[0];
        }
    }
    const method = req.method.toUpperCase();
    if (method === 'GET') {
        return res.viewAdmin('catalog', { entity: "entity", slug: slug, id: id });
    }
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        const data = req.body;
        const vueCatalog = new FrontentCatalogAdapter_1.VueCatalog(_catalog);
        if (!vueCatalog)
            return res.status(404);
        vueCatalog.setID(id);
        const item = vueCatalog.getItemType(data.type);
        switch (method) {
            case 'POST':
                switch (data._method) {
                    case 'getAddHTML':
                        return res.json(await vueCatalog.getAddHTML(item, req.session.UserAP.locale));
                    case 'getEditHTML':
                        return res.json(await vueCatalog.getEditHTML(item, data.id, req.session.UserAP.locale, data.modelId));
                    case 'getCatalog':
                        const __catalog = await vueCatalog.getCatalog();
                        return res.json({
                            'items': vueCatalog.getitemTypes(),
                            'catalog': {
                                nodes: __catalog,
                                movingGroupsRootOnly: _catalog.movingGroupsRootOnly ?? false,
                                catalogName: _catalog.name,
                                catalogId: _catalog.id,
                                catalogSlug: _catalog.slug,
                                idList: idList
                            },
                            'toolsActions': await vueCatalog.getActions([], 'tools')
                        });
                    case 'createItem':
                        return res.json({ 'data': await vueCatalog.createItem(data.data) });
                    case 'getChilds':
                        return res.json({ data: await vueCatalog.getChilds(data.data) });
                    case 'getActions':
                        return res.json({ data: await vueCatalog.getActions(data.items, data.type) });
                    case 'search':
                        return res.json({ data: await vueCatalog.search(data.s) });
                    case "getLocales":
                        return res.json({ data: vueCatalog.getLocales(req.session.UserAP.locale) });
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
                        return res.json({ data: await vueCatalog.updateItem(item, data.modelId, data.data) });
                }
                break;
            case 'DELETE':
                return res.json({ data: await vueCatalog.deleteItem(data.data) });
        }
    }
}
exports.catalogController = catalogController;
