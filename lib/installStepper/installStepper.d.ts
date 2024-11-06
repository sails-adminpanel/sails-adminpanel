import InstallStepAbstract from "./InstallStepAbstract";
interface RenderData {
    totalStepCount: number;
    leftStepsCount: number;
    currentStep: InstallStepAbstract;
    locale: string;
}
export declare class InstallStepper {
    id: string;
    private steps;
    context: any;
    readonly canBeClosed: boolean;
    static instances: InstallStepper[];
    constructor(id: string, canBeClosed?: boolean);
    static addStepper(stepper?: InstallStepper): void;
    static getStepper(stepperId: string): InstallStepper;
    static deleteStepper(stepperId: string): void;
    static getInstance(): InstallStepper;
    getSteps(): InstallStepAbstract[];
    processStep(stepId: string, data: any): Promise<void>;
    private getStepById;
    /** Prepares steps array for user interface render */
    render(locale: string): RenderData;
    skipStep(stepId: string): Promise<void>;
    /** Add step (replace if it already exists) */
    addStep(step: InstallStepAbstract): void;
    hasUnprocessedSteps(): boolean;
    getNextUnprocessedStep(): InstallStepAbstract;
    hasUnfinalizedSteps(): boolean;
    getFinalizeStatus(): {
        status: string;
        finalizeList: {
            id: string;
            status: "pending" | "fulfilled" | "rejected";
            description: string;
            info: string;
        }[];
    };
}
export {};
