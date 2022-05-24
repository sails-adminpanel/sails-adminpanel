/**
 * Welcome text
 *
 * @param {*} req
 * @param {*} res
 * @returns {dashboardController}
 */
export default function welcome(req, res) {

    return res.viewAdmin('welcome', { instance: "instance"});
};
