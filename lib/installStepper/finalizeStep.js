"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstallStepAbstract_1 = require("./InstallStepAbstract");
class FinalizeStep extends InstallStepAbstract_1.default {
    constructor() {
        super(...arguments);
        this.canBeSkipped = false;
        this.description = '';
        this.ejsPath = `${sails.config.adminpanel.pathToViews}/ejs/installer/finalize.ejs`;
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
        this.isProcessed = true;
    }
    async skip() {
        this.isProcessed = true;
    }
    finally() {
        return Promise.resolve(undefined);
    }
}
exports.default = FinalizeStep;
