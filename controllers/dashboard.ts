/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function(req, res) {

    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
    }

    return res.viewAdmin('dashboard', { instance: "instance" });
};