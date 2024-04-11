import InstallStepAbstract from "./InstallStepAbstract";
interface RenderData {
    totalStepCount: number;
    leftStepsCount: number;
    currentStep: InstallStepAbstract;
    locale: string;
}
export declare class InstallStepper {
    private static steps;
    static context: any;
    static getSteps(): InstallStepAbstract[];
    static processStep(stepId: string, data: any): Promise<void>;
    private static getStepById;
    /** Prepares steps array for user interface render */
    static render(locale: string): RenderData;
    static skipStep(stepId: string): Promise<void>;
    /** Add step (replace if it already exists) */
    static addStep(step: InstallStepAbstract): void;
    static hasUnprocessedSteps(): boolean;
    static getNextUnprocessedStep(): InstallStepAbstract;
    static hasUnfinalizedSteps(): boolean;
    static getFinalizeStatus(): {
        status: string;
        finalizeList: {
            id: string;
            status: "pending" | "fulfilled" | "rejected";
            description: string;
        }[];
    };
}
export {};
