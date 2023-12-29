"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallStepper = void 0;
class InstallStepper {
    static getSteps() {
        return this.steps;
    }
    // TODO добавить в доку как добавлять степы и в принципе как это все работает
    static async processStep(stepId, data) {
        try {
            /** As we sort steps by sortOrder, we should check that previous steps were processed */
            const stepIndex = this.steps.findIndex(item => item.id === stepId);
            for (let i = 0; i < stepIndex; i++) {
                if (this.steps[i].canBeSkipped && this.steps[i].isSkipped) {
                    continue;
                }
                let checkResult = await this.steps[i].check();
                if (checkResult === false) {
                    throw `Previous step was not processed`;
                }
            }
            let step = this.getStepById(stepId);
            await step.process(data);
        }
        catch (e) {
            sails.log.error(`Error processing step: ${e}`);
            throw new Error(e);
        }
    }
    static getStepById(stepId) {
        const step = this.steps.find(item => item.id === stepId);
        if (!step) {
            throw `Step [${stepId}] not found`;
        }
        return step;
    }
    /** Prepares steps array for user interface render */
    static render() {
        let steps = [];
        // TODO there will be some checks about errors and some important properties
        return { totalStepCount: 0, processedStepCount: 0, leftSteps: steps };
    }
    static async skipStep(stepId) {
        try {
            let step = this.getStepById(stepId);
            await step.skipIt();
        }
        catch (e) {
            sails.log.error(`Error skipping step: ${e}`);
        }
    }
    /** Add step (replace if it already exists) */
    static addStep(step) {
        const stepIndex = this.steps.findIndex(item => item.id === step.id);
        if (stepIndex !== -1) {
            this.steps[stepIndex] = step;
        }
        else {
            this.steps.push(step);
        }
        this.steps.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    static hasUnprocessedSteps() {
        return this.steps.some(step => !step.isProcessed);
    }
}
exports.InstallStepper = InstallStepper;
InstallStepper.steps = [];
