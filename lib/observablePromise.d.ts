export declare class ObservablePromise<T> {
    private _status;
    private _info;
    private _promise;
    constructor(promise: Promise<T>, timeout: number);
    get promise(): Promise<T>;
    get status(): 'pending' | 'fulfilled' | 'rejected';
    get info(): string;
}
