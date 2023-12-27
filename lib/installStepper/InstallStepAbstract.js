"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstallStepAbstract {
    constructor() {
        this.isSkipped = false;
        this.isProcessed = false;
    }
    async skipIt() {
        if (this.canBeSkipped === false) {
            throw `Step [${this.title}] can not be skipped`;
        }
        else {
            await this.skip();
        }
    }
}
exports.default = InstallStepAbstract;
