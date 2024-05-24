"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogController = void 0;
async function catalogController(req, res) {
    let slug = req.param('slug');
    if (req.method.toUpperCase() === 'GET') {
        if (sails.config.adminpanel.auth && !req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        return res.viewAdmin('catalog', { entity: "entity", slug: slug });
    }
}
exports.catalogController = catalogController;
