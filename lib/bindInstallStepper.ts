import {InstallStepper} from "./installStepper/installStepper";
let installStepper = InstallStepper.getInstance();

export default function() {
    let installStepperPolicy = function (req, res, proceed) {
        if (!req.session.UserAP) {
            return proceed();
        }

		let goingToProcessInstallStep = req._parsedUrl.pathname === `${sails.config.adminpanel.routePrefix}/processInstallStep`;
		let goingToProcessInstallFinalize = req._parsedUrl.pathname === `${sails.config.adminpanel.routePrefix}/processInstallFinalize`;

        if (installStepper.hasUnprocessedSteps() && !goingToProcessInstallStep && !goingToProcessInstallFinalize) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/processInstallStep`)
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
