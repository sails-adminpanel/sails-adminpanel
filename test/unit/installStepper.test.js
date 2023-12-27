"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const InstallStepAbstract_1 = require("../../lib/installStepper/InstallStepAbstract");
const installStepper_1 = require("../../lib/installStepper/installStepper");
class SkippedTestStep extends InstallStepAbstract_1.default {
    constructor() {
        super(...arguments);
        this.canBeSkipped = true;
        this.description = "";
        this.ejsPath = "";
        this.id = "skippedTest";
        this.scriptsUrl = "";
        this.sortOrder = 0;
        this.stylesUrl = "";
        this.title = "Skipped Test Step";
        this.isProcessed = false;
        this.isSkipped = false;
    }
    async check() {
        return this.isProcessed;
    }
    async process(data) {
        this.isProcessed = true;
    }
    async skip() {
        this.canBeSkipped = true;
    }
}
class NonSkippedTestStep extends InstallStepAbstract_1.default {
    constructor() {
        super(...arguments);
        this.canBeSkipped = false;
        this.description = "";
        this.ejsPath = "";
        this.id = "nonSkippedTest";
        this.scriptsUrl = "";
        this.sortOrder = 0;
        this.stylesUrl = "";
        this.title = "Non Skipped Test Step";
        this.isProcessed = false;
        this.isSkipped = false;
    }
    async check() {
        return this.isProcessed;
    }
    async process(data) {
        this.isProcessed = true;
    }
    async skip() {
        throw "Can not be skipped";
    }
}
const dataToProcess = {};
describe('Install Stepper Test', function () {
    it('should add and get steps correctly', () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        installStepper_1.InstallStepper.addStep(step2);
        const steps = installStepper_1.InstallStepper.getSteps();
        chai_1.expect(steps).to.deep.equal([step1, step2]);
    });
    it('should process steps in order', async () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        installStepper_1.InstallStepper.addStep(step2);
        await installStepper_1.InstallStepper.processStep(step1.id, dataToProcess);
        await installStepper_1.InstallStepper.processStep(step2.id, dataToProcess);
        chai_1.expect(step1.isProcessed).to.equal(true);
        chai_1.expect(step2.isProcessed).to.equal(true);
    });
    it('should handle check returning false', async () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        installStepper_1.InstallStepper.addStep(step2);
        // Mocking check to always return false
        step1.isProcessed = false;
        step2.isProcessed = false;
        try {
            await installStepper_1.InstallStepper.processStep(step2.id, dataToProcess);
        }
        catch (error) {
            chai_1.expect(error.message).to.equal('Previous step was not processed');
        }
        chai_1.expect(step1.isProcessed).to.equal(false);
    });
    it('should handle errors during processing', async () => {
        const step1 = new SkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        // Mocking process to throw an error
        step1.process = async () => {
            throw new Error('Simulated process error');
        };
        try {
            await installStepper_1.InstallStepper.processStep(step1.id, dataToProcess);
        }
        catch (error) {
            chai_1.expect(error.message).to.equal('Simulated process error');
        }
    });
    it('should skip steps correctly', () => {
        const step1 = new SkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        installStepper_1.InstallStepper.skipStep(step1.id);
        chai_1.expect(step1.canBeSkipped).to.equal(true);
    });
    it('should handle step not found', async () => {
        const stepId = 'nonexistentStep';
        try {
            await installStepper_1.InstallStepper.processStep(stepId, dataToProcess);
        }
        catch (error) {
            chai_1.expect(error.message).to.equal(`Step [${stepId}] not found`);
        }
    });
    it('should handle errors from check and process methods', async () => {
        const step1 = new SkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        // Mocking check to throw an error
        step1.check = async () => {
            throw new Error('Simulated check error');
        };
        try {
            await installStepper_1.InstallStepper.processStep(step1.id, dataToProcess);
        }
        catch (error) {
            chai_1.expect(error.message).to.equal('Simulated check error');
        }
    });
    it('should correctly identify unprocessed steps', () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();
        installStepper_1.InstallStepper.addStep(step1);
        installStepper_1.InstallStepper.addStep(step2);
        // Assuming all steps are unprocessed initially
        chai_1.expect(installStepper_1.InstallStepper.hasUnprocessedSteps()).to.equal(true);
        // Processing one step
        step1.isProcessed = true;
        // Now, only the second step is unprocessed
        chai_1.expect(installStepper_1.InstallStepper.hasUnprocessedSteps()).to.equal(true);
        // Processing the second step
        step2.isProcessed = true;
        // Now, no steps are unprocessed
        chai_1.expect(installStepper_1.InstallStepper.hasUnprocessedSteps()).to.equal(false);
    });
});
