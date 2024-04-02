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
    /** Action that will be run when saving data to storage */
    abstract process(data: any): Promise<void>;
    /** Action that will be run when skipping the step */
    protected abstract skip(): Promise<void>;
    skipIt(): Promise<void>;
    /** Checks that step should be processed during install */
    abstract check(): Promise<boolean>;
}
