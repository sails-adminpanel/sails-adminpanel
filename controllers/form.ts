import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {FormHelper} from "../helper/formHelper";

export default async function form(req, res) {
    let slug = req.param('slug');

    //Check slug
    if (!slug) {
        return res.notFound();
    }

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`update-${slug}-form`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let form = await FormHelper.get(slug);

    if (!form) {
        return res.status(404).send("Adminpanel > Form not found")
    }


    if (req.method.toUpperCase() === 'POST') {

        if (!req.body) {
            return res.status(500).send("Data is empty")
        }

        for (let field of Object.keys(req.body)) {
            await sails.config.adminpanel.forms.set(slug, field, req.body[field])
        }
    }

    for (let key of Object.keys(form)) {
        let value = await sails.config.adminpanel.forms.get(slug, key);
        if (value) {
            form[key].value = value;
        }
    }

    res.viewAdmin("form", {formData: form, slug: slug});
};
