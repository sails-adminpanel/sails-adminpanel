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
            step.isProcessed = true;
            // clear steps if all of them was processed
            if (!this.hasUnprocessedSteps()) {
                this.steps = [];
            }
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
        let stepToRender = this.getNextUnprocessedStep();
        let leftSteps = this.steps.filter(step => !step.isProcessed && !step.isSkipped);
        // TODO there will be some checks about errors and some important properties
        // TODO нужно vue приложение, которое будет загружаться из файла ejs при рендере степов. Данные заполненные
        //  юзером в этом приложении должны прийти на контроллер (надо создать), который выполнит логику
        //  (check, process/skip, render) и отдаст новый степ для заполнения. Vue приложение должно только построить форму по uiSchema.
        //  Приоритетна отправка через partial forms data (а не xhr как в vue). jsonforms будет генерить данные в скрытые поля,
        //  а кнопка "отправить" будет работать как обычная html форма с отправкой со скрытых полей.
        //  Vue приложение вместе с json-формой должно работать по аналогии как работали jquery (плагином).
        //  Подключить это все в gulp чтоб Web-pack это все собрал (как подключен dashboard)
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
        if (step.renderer !== "jsonforms") {
            /** The ability of adding ejs inside step is being planned for customising installer */
            throw "Install stepper error: Allowed renderer is only jsonforms for now";
        }
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
    static getNextUnprocessedStep() {
        return this.steps.find(step => !step.isProcessed && !step.isSkipped);
    }
}
exports.InstallStepper = InstallStepper;
InstallStepper.steps = [];
