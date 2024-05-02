export class ObservablePromise<T> {
    private _status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private _promise: Promise<T>;

    constructor(promise: Promise<T>, timeout: number) {
        this._promise = new Promise<T>((resolve, reject) => {

            sails.log.debug("IN OBSERVABLE PROMISE WITH HARDCORE TIMEOUT")

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
                .then(
                    (value: T) => {
                        sails.log.debug("IN PROMISE RACE fulfilled")
                        this._status = 'fulfilled';
                        resolve(value);
                    },
                    (error) => {
                        sails.log.debug("IN PROMISE RACE rejected")
                        this._status = 'rejected';
                        reject(error);
                    }
                );
        });
    }

    get promise(): Promise<T> {
        return this._promise;
    }

    get status(): 'pending' | 'fulfilled' | 'rejected' {
        return this._status;
    }
}

