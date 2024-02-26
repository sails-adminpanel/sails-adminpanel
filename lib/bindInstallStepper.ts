import {InstallStepper} from "./installStepper/installStepper"

export default function() {
    let installStepperPolicy = function (req, res, proceed) {
        if (InstallStepper.hasUnprocessedSteps()) {
            let renderData = InstallStepper.render();
            let renderer = renderData.currentStep.renderer;
            return res.viewAdmin(`installer/${renderer}`, renderData);
        }

        return proceed()
    }

    if (Array.isArray(sails.config.adminpanel.policies) && typeof sails.config.adminpanel.policies[0] !== "string") {
        // @ts-ignore
        sails.config.adminpanel.policies.push(installStepperPolicy)
    } else {
        sails.log.error("Can not bind install stepper. Policies is not array");
    }
};
