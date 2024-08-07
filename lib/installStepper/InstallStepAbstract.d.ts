import { ObservablePromise } from "../observablePromise";
export default abstract class InstallStepAbstract {
    abstract id: string;
    abstract title: string;
    abstract badge: string;
    abstract sortOrder: number;
    /** Step can be skipped. For this option you should do realization for skip handler */
    abstract canBeSkipped: boolean;
    abstract description: string;
    abstract scriptsUrl: string;
    abstract stylesUrl: string;
    /** Absolute path to ejs template */
    abstract ejsPath: string;
    abstract renderer: "ejs" | "jsonforms";
    isSkipped: boolean;
    isProcessed: boolean;
    /** Data that will be given to browser */
    payload: any;
    groupSortOrder: number;
    finallyPromise: ObservablePromise<void>;
    finallyDescription: string;
    /**
     * A sign that finalization should be started
     */
    finallyToRun: boolean;
    /**
     * The time it takes for finally to complete
     *
     * default: 15 seconds
     *
     * maximum: 10 minutes;
     */
    finallyTimeout: number;
    /** Action that will be run when saving data to storage */
    abstract process(data: any, context?: any): Promise<void>;
    /** Method will be called after processing step (both process or skip) */
    finally(data: any, context?: any): Promise<void>;
    /** This method will be called by InstallStepper and is a wrapper for "finally" method */
    toFinally(data?: any, context?: any, timeout?: number): void;
    /** Action that will be run when skipping the step */
    protected abstract skip(): Promise<void>;
    /** This method will be called by InstallStepper and is a wrapper for "skip" method */
    skipIt(): Promise<void>;
    /**
     * Checks that step should be processed during install
     * `true` means that the step has been completed and does not need to be shown
    */
    abstract check(): Promise<boolean>;
    onInit(): Promise<void>;
}
