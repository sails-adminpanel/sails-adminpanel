"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const installStepper_1 = require("../lib/installStepper/installStepper");
async function processInstallStep(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    if (req.method.toUpperCase() === 'GET') {
        console.log("GET REQUEST TO PROCESS INSTALL STEP");
        if (installStepper_1.InstallStepper.hasUnprocessedSteps()) {
            console.log(installStepper_1.InstallStepper.getSteps());
            let renderData = installStepper_1.InstallStepper.render();
            // let renderer = renderData.currentStep.renderer;
            // console.log("renderer", renderer)
            // return res.viewAdmin(`installer/${renderer}`, renderData);
            return res.viewAdmin(`installer/dev`, renderData);
        }
        else {
            return res.redirect(`${sails.config.adminpanel.routePrefix}`);
        }
    }
    if (req.method.toUpperCase() === 'POST') {
        console.log("POST REQUEST TO PROCESS INSTALL STEP");
        // TODO если тип json и нету ui-schema, то vue будет строить ui-schema по json схеме (добавить потом пример
        //  такой настройки когда будет готово vue app)
        // TODO есть еще проблема в том, то админка успевает пропустить пользователя по роуту до того как policy сработает
        if (req.body.inputData) {
            console.log("INPUT DATA", JSON.parse(req.body.inputData));
        }
        else {
            console.log("NO INPUT DATA, THIS IS SKIP");
        }
        try {
            const currentStepId = req.body.currentStepId;
            if (req.body.action === 'next') {
                const inputData = JSON.parse(req.body.inputData);
                // trying to process step
                await installStepper_1.InstallStepper.processStep(currentStepId, inputData);
            }
            else if (req.body.action === 'skip') {
                // trying to skip step
                await installStepper_1.InstallStepper.skipStep(currentStepId);
            }
            else {
                return res.status(400).send("Invalid action parameter");
            }
            // go back to stepper if there are more unprocessed steps, otherwise go back to /admin
            if (installStepper_1.InstallStepper.hasUnprocessedSteps()) {
                return res.redirect(`${sails.config.adminpanel.routePrefix}/processInstallStep`);
            }
            else {
                return res.redirect(`${sails.config.adminpanel.routePrefix}`);
            }
        }
        catch (error) {
            console.error("Error processing step:", error);
            return res.status(500).send("Error processing step");
        }
    }
    return res.status(500).send("Invalid request method");
}
exports.default = processInstallStep;
;
