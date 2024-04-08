"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observablePromise_1 = require("../observablePromise");
class InstallStepAbstract {
    constructor() {
        this.isSkipped = false;
        this.isProcessed = false;
        /** Data that will be given to browser */
        this.payload = {};
        this.groupSortOrder = 1;
        this.finallyPromise = null;
        this.finallyDescription = null;
    }
    /** Method will be called after processing step (both process or skip) */
    finally() {
        return null;
    }
    /** This method will be called by InstallStepper and is a wrapper for "finally" method */
    toFinally(timeout = 15 * 60 * 1000) {
        if (this.finallyPromise && this.finallyPromise.status === "pending") {
            sails.log.warn(`Method "finally" was already executed and won't be executed again`);
        }
        else {
            this.finallyPromise = new observablePromise_1.ObservablePromise(this.finally(), timeout);
        }
        this.finallyPromise.promise;
    }
    /** This method will be called by InstallStepper and is a wrapper for "skip" method */
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
