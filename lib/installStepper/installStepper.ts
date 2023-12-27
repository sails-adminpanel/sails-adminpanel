import InstallStepAbstract from "./InstallStepAbstract";

interface RenderData {
    totalStepCount: number
    processedStepCount: number
    leftSteps: InstallStepAbstract[]
}

export class InstallStepper {
    private static steps: InstallStepAbstract[] = [];

    public static getSteps(): InstallStepAbstract[] {
        return this.steps;
    }

    public static async processStep(stepId: string, data: any) {
        // TODO нужно ли ловить ошибку? Или лучше пускай throw летит наружу? Тест как раз ждет ошибки наружу
        try {
            /** As we sort steps by sortOrder, we should check that previous steps were processed */
            const stepIndex = this.steps.findIndex(item => item.id === stepId)
            for (let i = 0; i < stepIndex; i++) {
                if (this.steps[i].canBeSkipped && this.steps[i].isSkipped) {
                    continue
                }

                let checkResult = await this.steps[i].check();
                if (checkResult === false) {
                    throw `Previous step was not processed`
                }
            }

            let step = this.getStepById(stepId);
            await step.process(data);

        } catch (e) {
            sails.log.error(`Error processing step: ${e}`);
        }
    }

    private static getStepById(stepId: string): InstallStepAbstract {
        const step = this.steps.find(item => item.id === stepId);
        if (!step) {
            throw `Step [${stepId}] not found`
        }

        return step;
    }

    /** Prepares steps array for user interface render */
    public static render(): RenderData {
        let steps: InstallStepAbstract[] = [];
        // TODO there will be some checks about errors and some important properties

        return {totalStepCount: 0, processedStepCount: 0, leftSteps: steps};
    }

    public static async skipStep(stepId: string) {
        try {
            let step = this.getStepById(stepId);
            await step.skipIt();

        } catch (e) {
            sails.log.error(`Error skipping step: ${e}`);
        }
    }

    /** Add step (replace if it already exists) */
    public static addStep(step: InstallStepAbstract) {
        const stepIndex = this.steps.findIndex(item => item.id === step.id)
        if (stepIndex !== -1) {
            this.steps[stepIndex] = step;

        } else {
            this.steps.push(step);
        }

        this.steps.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    public static hasUnprocessedSteps(): boolean {
        return this.steps.some(step => !step.isProcessed);
    }
}
