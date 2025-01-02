/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function(req: ReqTypeAP, res: ResTypeAP) {

    if (adminizer.config.auth && !req.session.UserAP) {
        return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
    }

    return res.viewAdmin('dashboard', { entity: "entity" });
};
