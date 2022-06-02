/**
 * Will generate dashboard controller
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function(req, res) {

    return res.viewAdmin('dashboard', { instance: "instance", currentUser: req.session.UserAP });
};
