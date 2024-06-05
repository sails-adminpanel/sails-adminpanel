"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const installStepper_1 = require("./installStepper/installStepper");
let installStepper = installStepper_1.InstallStepper.getInstance();
function default_1() {
    let installStepperPolicy = function (req, res, proceed) {
        if (!req.session.UserAP) {
            return proceed();
        }
        let goingToProcessInstallStep = req._parsedUrl.pathname === `${sails.config.adminpanel.routePrefix}/processInstallStep`;
        let goingToProcessInstallFinalize = req._parsedUrl.pathname === `${sails.config.adminpanel.routePrefix}/processInstallFinalize`;
        if (installStepper.hasUnprocessedSteps() && !goingToProcessInstallStep && !goingToProcessInstallFinalize) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/processInstallStep`);
        }
        return proceed();
    };
    if (Array.isArray(sails.config.adminpanel.policies) && typeof sails.config.adminpanel.policies[0] !== "string") {
        // @ts-ignore
        sails.config.adminpanel.policies.push(installStepperPolicy);
    }
    else {
        sails.log.error("Can not bind install stepper. Policies is not array");
    }
}
exports.default = default_1;
;
