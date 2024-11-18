export declare class POWCaptcha {
    private static taskStorage;
    private static taskQueue;
    getJob(label: string): Promise<CaptchaJob>;
    check(resolvedCaptcha: ResolvedCaptcha, label: string): Promise<boolean>;
    private deleteTask;
}
export type TaskStorage = {
    [key: string]: {
        /** Captcha Job */
        task: CaptchaJob;
        /** Identifies the action for which it was resolved */
        label: string;
        time: number;
        puzzle: any;
    };
};
export type CaptchaJob = {
    id: string;
    task: string | number;
};
export type ResolvedCaptcha = {
    id: string;
    solution: string;
};
