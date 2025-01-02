/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function welcome(req: ReqTypeAP, res: ResTypeAP) {

    if (adminizer.config.auth && !req.session.UserAP) {
        return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }

    return res.viewAdmin('welcome', { entity: "entity" });
};
