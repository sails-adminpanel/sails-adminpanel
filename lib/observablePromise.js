"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservablePromise = void 0;
class ObservablePromise {
    constructor(promise, timeout) {
        this._status = 'pending';
        this._promise = new Promise((resolve, reject) => {
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
                this._status = 'fulfilled';
                resolve(value);
            }, (error) => {
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
