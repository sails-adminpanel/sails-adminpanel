/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function welcome(req: ReqType, res: ResType) {

    if (sails.config.adminpanel.auth && !req.session.UserAP) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }

    return res.viewAdmin('welcome', { entity: "entity" });
};
