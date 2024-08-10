"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observablePromise_1 = require("../observablePromise");
class InstallStepAbstract {
    constructor() {
        /** For custom modules to set the list of settings wanted to set in this step */
        this.settingsKeys = [];
        this.isSkipped = false;
        this.isProcessed = false;
        /** Data that will be given to browser */
        this.payload = {};
        this.groupSortOrder = 1;
        this.finallyPromise = null;
        this.finallyDescription = null;
        /**
         * A sign that finalization should be started
         */
        this.finallyToRun = false;
        /**
         * The time it takes for finally to complete
         *
         * default: 15 seconds
         *
         * maximum: 10 minutes;
         */
        this.finallyTimeout = 15 * 60 * 1000;
    }
    /** Method will be called after processing step (both process or skip) */
    finally(data, context) {
        return null;
    }
    /** This method will be called by InstallStepper and is a wrapper for "finally" method */
    toFinally(data, context, timeout) {
        sails.log.debug(`To finally [${this.id}]`);
        if (!timeout) {
            timeout = this.finallyTimeout;
        }
        if (!timeout || typeof timeout !== "number") {
            timeout = 15 * 60 * 1000;
        }
        if (timeout > 10 * 60 * 60 * 1000) {
            timeout = 10 * 60 * 60 * 1000;
        }
        if (typeof arguments[0] === "number") {
            timeout = arguments[0];
        }
        if (this.finallyPromise && this.finallyPromise.status === "pending") {
            sails.log.warn(`Method "finally" was already executed and won't be executed again`);
        }
        else {
            try {
                this.finallyPromise = new observablePromise_1.ObservablePromise(this.finally(data, context), timeout);
            }
            catch (error) {
                sails.log.error(`Step [${this.id}] finally error:`, error);
            }
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
    async onInit() {
        return;
    }
}
exports.default = InstallStepAbstract;
