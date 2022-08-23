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
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${slug}-form`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    for (let prop in req.body) {
        try {
            req.body[prop] = JSON.parse(req.body[prop]);
        }
        catch (e) {
            if (typeof req.body[prop] === "string" && req.body[prop].replace(/(\r\n|\n|\r|\s{2,})/gm, "") &&
                e.message !== "Unexpected end of JSON input" && !/Unexpected (token .|number) in JSON at position \d/.test(e.message)) {
                sails.log.error(JSON.stringify(req.body[prop]), e);
            }
        }
    }
    let form = await formHelper_1.FormHelper.get(slug);
    if (!form) {
        return res.status(404).send("Adminpanel > Form not found");
    }
    if (req.method.toUpperCase() === 'POST') {
        if (!req.body) {
            return res.status(500).send("Data is empty");
        }
        // checkboxes processing
        let checkboxes = [];
        for (let key in form) {
            if (form[key].type === "boolean") {
                checkboxes.push(key);
            }
        }
        for (let field of checkboxes) {
            if (!req.body[field]) {
                await sails.config.adminpanel.forms.set(slug, field, false);
            }
        }
        for (let field of Object.keys(req.body)) {
            await sails.config.adminpanel.forms.set(slug, field, req.body[field]);
        }
    }
    for (let key of Object.keys(form)) {
        try {
            form[key].value = await sails.config.adminpanel.forms.get(slug, key);
        }
        catch (e) {
            sails.log.silly(`'${slug}' property was not found in storage, using source file`);
        }
    }
    res.viewAdmin("form", { formData: form, slug: slug });
}
exports.default = form;
;
