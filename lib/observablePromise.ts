export class ObservablePromise<T> {
    private _status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private _promise: Promise<T>;

    constructor(promise: Promise<T>, timeout: number) {
        this._promise = new Promise<T>((resolve, reject) => {

            const timerPromise = new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    clearTimeout(timer); // Очистка таймера перед вызовом reject
                    reject(new Error(`Promise timed out after ${timeout}ms`));
                }, timeout);

                // use main promise to clear the timer if main promise will be finished first
                promise.then((result) => {
                    clearTimeout(timer);
                    resolve(result);
                }, reject);
            });

            Promise.race([promise, timerPromise])
                .then(
                    (value: T) => {
                        this._status = 'fulfilled';
                        resolve(value);
                    },
                    (error) => {
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
