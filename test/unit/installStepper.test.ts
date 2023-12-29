import "mocha";
import {expect} from "chai";
import InstallStepAbstract from "../../lib/installStepper/InstallStepAbstract";
import {InstallStepper} from "../../lib/installStepper/installStepper";

class SkippedTestStep extends InstallStepAbstract {
    canBeSkipped: boolean = true;
    description: string = "";
    ejsPath: string = "";
    id: string = "skippedTest";
    scriptsUrl: string = "";
    sortOrder: number = 0;
    stylesUrl: string = "";
    title: string = "Skipped Test Step";
    isProcessed: boolean = false;
    isSkipped: boolean = false;

    async check(): Promise<boolean> {
        return this.isProcessed;
    }

    async process(data: any): Promise<void> {
        this.isProcessed = true;
    }

    async skip(): Promise<void> {
        this.canBeSkipped = true;
    }
}

class NonSkippedTestStep extends InstallStepAbstract {
    canBeSkipped: boolean = false;
    description: string = "";
    ejsPath: string = "";
    id: string = "nonSkippedTest";
    scriptsUrl: string = "";
    sortOrder: number = 0;
    stylesUrl: string = "";
    title: string = "Non Skipped Test Step";
    isProcessed: boolean = false;
    isSkipped: boolean = false;

    async check(): Promise<boolean> {
        return this.isProcessed;
    }

    async process(data: any): Promise<void> {
        this.isProcessed = true;
    }

    async skip(): Promise<void> {
        throw "Can not be skipped"
    }
}

const dataToProcess = {}

describe('Install Stepper Test', function () {
    it('should add and get steps correctly', () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();

        InstallStepper.addStep(step1);
        InstallStepper.addStep(step2);

        const steps = InstallStepper.getSteps();

        expect(steps).to.deep.equal([step1, step2]);
    });

    it('should process steps in order', async () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();

        InstallStepper.addStep(step1);
        InstallStepper.addStep(step2);

        await InstallStepper.processStep(step1.id, dataToProcess);
        await InstallStepper.processStep(step2.id, dataToProcess);

        expect(step1.isProcessed).to.equal(true);
        expect(step2.isProcessed).to.equal(true);
    });

    it('should handle check returning false', async () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();

        InstallStepper.addStep(step1);
        InstallStepper.addStep(step2);

        // Mocking check to always return false
        step1.isProcessed = false;
        step2.isProcessed = false;

        try {
            await InstallStepper.processStep(step2.id, dataToProcess);
        } catch (error) {
            expect(error.message).to.equal('Previous step was not processed');
        }
        expect(step1.isProcessed).to.equal(false);
    });

    it('should handle errors during processing', async () => {
        const step1 = new SkippedTestStep();

        InstallStepper.addStep(step1);

        // Mocking process to throw an error
        step1.process = async () => {
            throw new Error('Simulated process error');
        };

        try {
            await InstallStepper.processStep(step1.id, dataToProcess);
        } catch (error) {
            expect(error.message).to.equal('Error: Simulated process error');
        }
    });

    it('should skip steps correctly', () => {
        const step1 = new SkippedTestStep();

        InstallStepper.addStep(step1);

        InstallStepper.skipStep(step1.id);

        expect(step1.canBeSkipped).to.equal(true);
    });

    it('should handle step not found', async () => {
        const stepId = 'nonexistentStep';

        try {
            await InstallStepper.processStep(stepId, dataToProcess);
        } catch (error) {
            expect(error.message).to.equal(`Step [${stepId}] not found`);
        }
    });

    it('should handle errors from check and process methods', async () => {
        const step1 = new SkippedTestStep();

        InstallStepper.addStep(step1);

        // Mocking check to throw an error
        step1.check = async () => {
            throw new Error('Simulated check error');
        };

        try {
            await InstallStepper.processStep(step1.id, dataToProcess);
        } catch (error) {
            expect(error.message).to.equal('Simulated check error');
        }
    });

    it('should correctly identify unprocessed steps', () => {
        const step1 = new SkippedTestStep();
        const step2 = new NonSkippedTestStep();

        InstallStepper.addStep(step1);
        InstallStepper.addStep(step2);

        // Assuming all steps are unprocessed initially
        expect(InstallStepper.hasUnprocessedSteps()).to.equal(true);

        // Processing one step
        step1.isProcessed = true;

        // Now, only the second step is unprocessed
        expect(InstallStepper.hasUnprocessedSteps()).to.equal(true);

        // Processing the second step
        step2.isProcessed = true;

        // Now, no steps are unprocessed
        expect(InstallStepper.hasUnprocessedSteps()).to.equal(false);
    });

});
