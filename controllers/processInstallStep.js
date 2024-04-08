"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const installStepper_1 = require("../lib/installStepper/installStepper");
const path = require("path");
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
        console.log(installStepper_1.InstallStepper.getSteps());
        if (installStepper_1.InstallStepper.hasUnfinalizedSteps() && !installStepper_1.InstallStepper.hasUnprocessedSteps()) {
            console.log(installStepper_1.InstallStepper.getSteps());
            console.log("YES, HAS UNFINALIZED STEPS");
            return res.redirect(`${sails.config.adminpanel.routePrefix}/processInstallFinalize`);
        }
        if (installStepper_1.InstallStepper.hasUnprocessedSteps()) {
            // console.log(InstallStepper.getSteps())
            let renderData = installStepper_1.InstallStepper.render();
            let renderer = renderData.currentStep.renderer;
            // console.log("renderer", renderer)
            return res.viewAdmin(`installer/${renderer}`, renderData);
            // return res.viewAdmin(`installer/dev`, renderData);
        }
        else {
            return res.redirect(`${sails.config.adminpanel.routePrefix}`);
        }
    }
    if (req.method.toUpperCase() === 'POST') {
        try {
            console.log("POST REQUEST TO PROCESS INSTALL STEP");
            console.log("req.body", req.body);
            const currentStepId = req.body.currentStepId;
            const filesCounter = req.body.filesCounter;
            // upload files before processing other fields (filesCounter > 0 means that req contains files)
            if (filesCounter && filesCounter > 0) {
                for (let i = 0; i < filesCounter; i++) {
                    let filesUpstream = req.file(`files_${i}`);
                    try {
                        await uploadFiles(filesUpstream, currentStepId);
                    }
                    catch (error) {
                        console.error('Error uploading files:', error);
                    }
                }
            }
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
function uploadFiles(files, currentStepId) {
    // TODO: Investigate system hang when trying to save a file, and execution of the code after save block does not process.
    //  The system seems to only proceed after encountering a timeout error.
    //  This issue is ruining the ability to upload multiple files.
    return new Promise((resolve, reject) => {
        files.upload({
            dirname: `installStepper/uploadedImages`,
            maxBytes: 100000000,
            saveAs: function (file, cb) {
                const extension = path.extname(file.filename);
                const baseName = path.basename(file.filename);
                const uniqueName = `${currentStepId}_${baseName}_${Date.now()}${extension}`;
                console.log("FILE", file.filename);
                cb(null, uniqueName);
            }
        }, (err, uploadedFiles) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            if (uploadedFiles && uploadedFiles.length) {
                console.log("DOWNLOADED FILES", uploadedFiles);
            }
            resolve();
        });
    });
}
