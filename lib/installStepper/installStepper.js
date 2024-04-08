"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallStepper = void 0;
const finalizeStep_1 = require("./finalizeStep");
const fs = require("fs");
class InstallStepper {
    static getSteps() {
        return this.steps;
    }
    static async processStep(stepId, data) {
        try {
            /** As we sort steps by sortOrder, we should check that previous steps were processed */
            const stepIndex = this.steps.findIndex(item => item.id === stepId);
            console.log("STEP INDEX", stepIndex);
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
            step.isProcessed = true;
            console.log(`STEP ${stepId} was processed`);
            // call finalize method
            step.toFinally();
        }
        catch (e) {
            sails.log.error(`Error processing step: ${e}`);
            console.dir(e);
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
        let stepToRender = this.getNextUnprocessedStep();
        let leftSteps = this.steps.filter(step => !step.isProcessed && !step.isSkipped);
        // TODO there will be some checks about errors and some important properties
        return { totalStepCount: this.steps.length, leftStepsCount: leftSteps.length, currentStep: stepToRender };
    }
    static async skipStep(stepId) {
        try {
            let step = this.getStepById(stepId);
            await step.skipIt();
            step.isSkipped = true;
        }
        catch (e) {
            sails.log.error(`Error skipping step: ${e}`);
        }
    }
    /** Add step (replace if it already exists) */
    static addStep(step) {
        if (step.renderer === "ejs") {
            if (!step.ejsPath || !fs.existsSync(step.ejsPath)) {
                throw `Step [${step.title}] error: ejs path does not exists`;
            }
        }
        const stepIndex = this.steps.findIndex(item => item.id === step.id);
        if (stepIndex !== -1) {
            this.steps[stepIndex] = step;
        }
        else {
            this.steps.push(step);
        }
        // sort by group, then by renderer and then by sortOrder
        this.steps.sort((a, b) => {
            if (a.groupSortOrder !== b.groupSortOrder) {
                return a.groupSortOrder - b.groupSortOrder;
            }
            else {
                if (a.renderer !== b.renderer) {
                    return a.renderer === 'ejs' ? -1 : 1;
                }
                else {
                    return a.sortOrder - b.sortOrder;
                }
            }
        });
    }
    static hasUnprocessedSteps() {
        return this.steps.some(step => !step.isProcessed && !step.isSkipped);
    }
    static getNextUnprocessedStep() {
        let nextStep = this.steps.find(step => !step.isProcessed && !step.isSkipped);
        if (!nextStep && this.hasUnfinalizedSteps()) {
            if (this.getStepById("finalize")) {
                nextStep = this.getStepById("finalize");
            }
            else {
                let timer = setInterval(() => {
                    // clear steps if all of them was processed and finalized
                    if (!this.hasUnprocessedSteps() && !this.hasUnfinalizedSteps()) {
                        this.steps = [];
                        clearInterval(timer);
                    }
                }, 5000);
                nextStep = new finalizeStep_1.default();
                this.addStep(nextStep);
            }
        }
        return nextStep;
    }
    static hasUnfinalizedSteps() {
        return this.steps.some(step => step.finallyPromise?.status === "pending");
    }
    static getFinalizeStatus() {
        let stepsWithFinalize = this.steps.filter(step => step.finallyPromise !== null);
        let generalStatus = "fulfilled";
        let stepFinalizeStatuses = stepsWithFinalize.map(item => {
            // if one of them is pending, general status is pending
            if (item.finallyPromise.status === "pending") {
                generalStatus = "pending";
            }
            return { id: item.id, status: item.finallyPromise.status, description: item.finallyDescription };
        });
        return { status: generalStatus, finalizeList: stepFinalizeStatuses ?? [] };
    }
}
exports.InstallStepper = InstallStepper;
InstallStepper.steps = [];
