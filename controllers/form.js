"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const formHelper_1 = require("../helper/formHelper");
async function form(req, res) {
    let slug = req.param('slug');
    //Check slug
    if (!slug) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${slug}-form`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let formData = formHelper_1.FormHelper.get(slug);
    if (!formData) {
        return res.status(404).send("Adminpanel > Form not found");
    }
    if (req.method.toUpperCase() === 'POST') {
        if (!req.body) {
            return res.status(500).send("Data is empty");
        }
        await formHelper_1.FormHelper.update(slug, req.body);
    }
    console.log("FORM DATA", slug, formData);
    res.viewAdmin("form", { formData: formData, slug: slug });
}
exports.default = form;
;
