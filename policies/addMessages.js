module.exports = async function (req, res, proceed) {
    if (!req.session.messages) {
        req.session.messages = {
            adminError: [],
            adminSuccess: []
        };
    }
    return proceed();
};
