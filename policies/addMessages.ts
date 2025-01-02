module.exports = async function (req: ReqTypeAP, res: ResTypeAP, proceed: ()=>void) {
    if (!req.session.messages) {
        req.session.messages = {
            adminError: [],
            adminSuccess: []
        }
    }

    return proceed()
}
