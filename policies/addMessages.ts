module.exports = async function (req: ReqType, res: ResType, proceed: Function) {
    if (!req.session.messages) {
        req.session.messages = {
            adminError: [],
            adminSuccess: []
        }
    }

    return proceed()
}
