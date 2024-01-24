import InstallStepAbstract from "./InstallStepAbstract";
interface RenderData {
    totalStepCount: number;
    leftStepsCount: number;
    currentStep: InstallStepAbstract;
}
export declare class InstallStepper {
    private static steps;
    static getSteps(): InstallStepAbstract[];
    static processStep(stepId: string, data: any): Promise<void>;
    private static getStepById;
    /** Prepares steps array for user interface render */
    static render(): RenderData;
    static skipStep(stepId: string): Promise<void>;
    /** Add step (replace if it already exists) */
    static addStep(step: InstallStepAbstract): void;
    static hasUnprocessedSteps(): boolean;
    static getNextUnprocessedStep(): InstallStepAbstract;
}
export {};
