"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstallStepAbstract_1 = require("./InstallStepAbstract");
const path = require("path");
const installStepper_1 = require("./installStepper");
class FinalizeStep extends InstallStepAbstract_1.default {
    constructor() {
        super(...arguments);
        this.canBeSkipped = false;
        this.description = '';
        this.ejsPath = path.resolve(__dirname, '../../views/ejs/installer/partials/finalize.ejs');
        this.id = 'finalize';
        this.scriptsUrl = '';
        this.sortOrder = 0;
        this.stylesUrl = '';
        this.title = 'Finalize Step';
        this.badge = '';
        this.isSkipped = false;
        this.settingsKeys = [];
        this.renderer = "ejs";
        this.isProcessed = false;
    }
    async check() {
        return this.isProcessed;
    }
    async process(data) {
        let installStepper = installStepper_1.InstallStepper.getInstance();
        if (!installStepper.hasUnfinalizedSteps()) {
            this.isProcessed = true;
        }
    }
    async skip() {
        let installStepper = installStepper_1.InstallStepper.getInstance();
        if (!installStepper.hasUnfinalizedSteps()) {
            this.isProcessed = true;
        }
    }
    finally() {
        return;
    }
    toFinally() {
        return;
    }
}
exports.default = FinalizeStep;
