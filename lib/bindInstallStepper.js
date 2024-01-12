"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const installStepper_1 = require("./installStepper/installStepper");
function default_1() {
    let installStepperPolicy = function (req, res, proceed) {
        if (installStepper_1.InstallStepper.hasUnprocessedSteps()) {
            let renderData = installStepper_1.InstallStepper.render();
            let renderer = renderData.currentStep.renderer;
            console.log("renderer", renderer);
            return res.viewAdmin(`installer/${renderer}`, renderData);
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
