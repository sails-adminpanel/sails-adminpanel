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

    let formData = FormHelper.get(slug);

    if (!formData) {
        return res.status(404).send("Adminpanel > Form not found")
    }

    if (req.method.toUpperCase() === 'POST') {

        if (!req.body) {
            return res.status(500).send("Data is empty")
        }

        console.log("REQ BODY", req.body)

        await FormHelper.update(slug, req.body);
    }

    console.log("FORM DATA", slug, formData)

    res.viewAdmin("form", {formData: formData, slug: slug});
};
