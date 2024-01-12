"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstallStepAbstract {
    constructor() {
        this.isSkipped = false;
        this.isProcessed = false;
        /** Data that will be given to browser */
        this.payload = {};
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
