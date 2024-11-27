/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function welcome(req: ReqType, res: ResType) {

    if (adminizer.config.auth && !req.session.UserAP) {
        return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }

    return res.viewAdmin('welcome', { entity: "entity" });
};
