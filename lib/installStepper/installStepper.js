"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallStepper = void 0;
const finalizeStep_1 = require("./finalizeStep");
const fs = require("fs");
const translationHelper_1 = require("../../helper/translationHelper");
class InstallStepper {
    static getSteps() {
        return this.steps;
    }
    static async processStep(stepId, data) {
        try {
            /** As we sort steps by sortOrder, we should check that previous steps were processed */
            const stepIndex = this.steps.findIndex(item => item.id === stepId);
            sails.log.debug("STEP INDEX", stepIndex);
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
            // get context copy and write down information in it on process without damaging source object
            let contextCopy = { ...this.context };
            await step.process(data, contextCopy);
            Object.assign(this.context, contextCopy);
            step.isProcessed = true;
            sails.log.debug(`STEP ${stepId} was processed`);
            // call finalize method only if has description
            if (step.finallyToRun) {
                contextCopy = { ...this.context };
                step.toFinally(data, this.context);
                Object.assign(this.context, contextCopy);
            }
        }
        catch (e) {
            sails.log.error(`Error processing step: ${e}`);
            throw new Error(e);
        }
    }
    static getStepById(stepId) {
        return this.steps.find(item => item.id === stepId);
    }
    /** Prepares steps array for user interface render */
    static render(locale) {
        let stepToRender = this.getNextUnprocessedStep();
        let leftSteps = this.steps.filter(step => !step.isProcessed && !step.isSkipped);
        // set locale
        if (typeof sails.config.adminpanel.translation !== "boolean") {
            if (!locale || !sails.config.adminpanel.translation.locales.includes(locale)) {
                locale = sails.config.adminpanel.translation.defaultLocale || "en";
            }
        }
        else {
            locale = "en";
        }
        this.context.locale = locale;
        // translate step
        stepToRender = translationHelper_1.TranslationHelper.translateProperties(stepToRender, locale, ["title", "description", "name"]);
        return {
            totalStepCount: this.steps.length,
            leftStepsCount: leftSteps.length,
            currentStep: stepToRender,
            locale: locale
        };
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
            sails.log.warn(`Attention! The step has been replaced\`${step.id}\``);
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
                        sails.log.debug("CLEARING STEPS", this.steps);
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
        sails.log.debug("stepsWithFinalize", stepsWithFinalize);
        let generalStatus = "fulfilled";
        let stepFinalizeStatuses = stepsWithFinalize.map(item => {
            // if one of them is pending, general status is pending
            if (item.finallyPromise.status === "pending") {
                generalStatus = "pending";
            }
            if (item.finallyPromise.status === "rejected") {
                generalStatus = "rejected";
            }
            return { id: item.id, status: item.finallyPromise.status, description: item.finallyDescription };
        });
        return { status: generalStatus, finalizeList: stepFinalizeStatuses ?? [] };
    }
}
exports.InstallStepper = InstallStepper;
InstallStepper.steps = [];
InstallStepper.context = {};
