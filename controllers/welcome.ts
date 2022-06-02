import {AccessRightsHelper} from "../helper/accessRightsHelper";

/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function welcome(req, res) {

    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
    }

    return res.viewAdmin('welcome', { instance: "instance", currentUser: req.session.UserAP });
};
