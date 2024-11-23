import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {InstallStepper} from "../lib/installStepper/installStepper";
import * as path from "path";

export default async function processInstallStep(req: ReqType, res: ResType): Promise<void> {
	if (adminizer.config.auth) {
		if (!req.session.UserAP) {
			res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
			return
		} else if (!AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
			res.sendStatus(403);
			return
		}
	}

	if (req.method.toUpperCase() === 'GET') {
		sails.log.debug("GET REQUEST TO PROCESS INSTALL STEP")
		let installStepper = InstallStepper.getStepper(req.params.id);
		if (!installStepper) {
			res.redirect(`${adminizer.config.routePrefix}`);
			return
		}

		if (installStepper.hasUnprocessedSteps() || installStepper.hasUnfinalizedSteps()) {
			let renderData = installStepper.render(req.session.UserAP.locale);
			let renderer = renderData.currentStep.renderer;
			// run onInit method before showing step to user
			try {
				await renderData.currentStep.onInit();
			} catch (e) {
				console.log("ERROR IN PROCESS INSTALL STEP", e)
				res.viewAdmin(`installer/error`, {error: e, stepperId: installStepper.id});
				return
			}

			res.viewAdmin(`installer/${renderer}`, {...renderData, stepperId: installStepper.id});
			return
		} else {
			res.redirect(`${adminizer.config.routePrefix}`);
			return
		}
	}

	if (req.method.toUpperCase() === 'POST') {

		try {
			sails.log.debug("POST REQUEST TO PROCESS INSTALL STEP", req.body)
			let installStepper = InstallStepper.getStepper(req.params.id);

			const currentStepId = req.body.currentStepId;
			const filesCounter = req.body.filesCounter;

			// upload files before processing other fields (filesCounter > 0 means that req contains files)
			let uploadedFiles = [];
			if (filesCounter && filesCounter > 0) {
				for (let i = 0; i < filesCounter; i++) {
					let filesUpstream = req.file(`files_${i}`);

					try {
						let uploadedFile = await uploadFiles(filesUpstream, currentStepId);
						uploadedFiles.push(uploadedFile);
					} catch (error) {
						sails.log.error('Error uploading files:', error);
					}
				}
			}

			if (req.body.action === 'next') {
				const inputData = JSON.parse(req.body.inputData);
				if (uploadedFiles.length) {
					inputData.uploadedFiles = uploadedFiles;
				}

				// trying to process step
				await installStepper.processStep(currentStepId, inputData);

			} else if (req.body.action === 'skip') {
				// trying to skip step
				await installStepper.skipStep(currentStepId);

			} else {
				res.status(400).send("Invalid action parameter");
				return
			}

			// go back to stepper if there are more unprocessed steps, otherwise go back to /admin
			if (installStepper.hasUnprocessedSteps()) {
				res.redirect(`${adminizer.config.routePrefix}/install/${installStepper.id}`);
				return
			} else {
				res.redirect(`${adminizer.config.routePrefix}`);
				return
			}

		} catch (error) {
			sails.log.error("Error processing step:", error);
			res.status(500).send("Error processing step");
			return
		}
	}

	if (req.method.toUpperCase() === 'DELETE') {
		sails.log.debug("DELETE REQUEST TO PROCESS INSTALL STEP", req.body)

		try {
			InstallStepper.deleteStepper(req.params.id);
			res.status(200).send("OK")
			return
		} catch (e) {
			res.status(403).send(e);
			return
		}
	}

	res.status(500).send("Invalid request method")
	return
};

function uploadFiles(files: ReturnType<ReqType['file']>, currentStepId: string | number) {
	// TODO: Investigate system hang when trying to save a file, and execution of the code after save block does not process.
	//  The system seems to only proceed after encountering a timeout error.
	//  This issue is ruining the ability to upload multiple files.

	return new Promise((resolve, reject) => {
		files.upload({
			dirname: `installStepper/uploadedImages`,
			maxBytes: 100000000,
			saveAs: function (file, cb) {
				const extension = path.extname(file.filename);
				const baseName = path.basename(file.filename, path.extname(file.filename));
				const uniqueName = `${currentStepId}_${baseName}_${Date.now()}${extension}`;
				cb(null, uniqueName);
			}
		}, (err, uploadedFiles) => {
			if (err) {
				sails.log.error(err);
				reject(err);

			} else if (uploadedFiles && uploadedFiles.length > 0) {
				const uploadedFile = uploadedFiles[0];
				const uploadedFileName = uploadedFile.fd;
				sails.log.debug("DOWNLOADED FILE", uploadedFileName);
				resolve(uploadedFileName);

			} else {
				reject(new Error("No files were uploaded"));
			}
		});
	});
}
