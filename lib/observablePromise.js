"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservablePromise = void 0;
class ObservablePromise {
    constructor(promise, timeout) {
        this._status = 'pending';
        this._promise = new Promise((resolve, reject) => {
            sails.log.debug("IN OBSERVABLE PROMISE WITH HARDCORE TIMEOUT");
            const timerPromise = new Promise((resolve, reject) => {
                // TODO check with hardcode timeout
                // const timer = setTimeout(() => {
                //     clearTimeout(timer); // Clearing the timer before calling reject
                //     reject(new Error(`Promise timed out after ${timeout}ms`));
                // }, timeout);
                const timer = setTimeout(() => {
                    clearTimeout(timer); // Clearing the timer before calling reject
                    reject(new Error(`Promise timed out after 100000ms, not ${timeout}ms`));
                }, 100000);
                // use main promise to clear the timer if main promise will be finished first
                promise.then((result) => {
                    clearTimeout(timer);
                    resolve(result);
                }, reject);
            });
            Promise.race([promise, timerPromise])
                .then((value) => {
                sails.log.debug("IN PROMISE RACE fulfilled");
                this._status = 'fulfilled';
                resolve(value);
            }, (error) => {
                sails.log.debug("IN PROMISE RACE rejected");
                this._status = 'rejected';
                reject(error);
            });
        });
    }
    get promise() {
        return this._promise;
    }
    get status() {
        return this._status;
    }
}
exports.ObservablePromise = ObservablePromise;
