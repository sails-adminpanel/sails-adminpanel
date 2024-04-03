export default abstract class InstallStepAbstract {
    public abstract id: string
    public abstract title: string
    public abstract badge: string
    public abstract sortOrder: number
    /** Step can be skipped. For this option you should do realization for skip handler */
    public abstract canBeSkipped: boolean
    public abstract description: string
    public abstract scriptsUrl: string
    public abstract stylesUrl: string
    /** Absolute path to ejs template */
    public abstract ejsPath: string
    public abstract renderer: "ejs" | "jsonforms"
    public isSkipped: boolean = false
    public isProcessed: boolean = false;
    /** Data that will be given to browser */
    public payload: any = {};
    public groupSortOrder: number = 1;

    /** Action that will be run when saving data to storage */
    public abstract process(data: any): Promise<void>

    /** Action that will be run when skipping the step */
    protected abstract skip(): Promise<void>

    public async skipIt(): Promise<void> {
        if (this.canBeSkipped === false) {
            throw `Step [${this.title}] can not be skipped`
        } else {
            await this.skip()
        }
    }

    /** Checks that step should be processed during install */
    public abstract check(): Promise<boolean>
}
