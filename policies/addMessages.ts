module.exports = async function (req: ReqType, res: ResType, proceed) {
    if (!req.session.messages) {
        req.session.messages = {
            adminError: [],
            adminSuccess: []
        }
    }

    return proceed()
}
