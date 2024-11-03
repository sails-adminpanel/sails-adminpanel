module.exports = async function (req: ReqType, res: ResType, proceed: ()=>void) {
    if (!req.session.messages) {
        req.session.messages = {
            adminError: [],
            adminSuccess: []
        }
    }

    return proceed()
}
