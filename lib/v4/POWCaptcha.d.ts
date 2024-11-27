export declare class POWCaptcha {
    private static taskStorage;
    private static taskQueue;
    private static readonly MAX_TASKS;
    getJob(label: string): Promise<number[]>;
    check(captchaSolution: string, label: string): boolean;
    private deleteTask;
}
export type TaskStorage = {
    [key: string]: {
        /** Identifies the action for which it was resolved */
        label: string;
        time: number;
        puzzle: Uint8Array;
    };
};
