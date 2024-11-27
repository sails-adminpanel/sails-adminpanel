import InstallStepAbstract from "./InstallStepAbstract";
import FinalizeStep from "./finalizeStep";
import * as fs from "fs";
import { TranslationHelper } from "../../helper/translationHelper";

interface RenderData {
    totalStepCount: number
    leftStepsCount: number
    currentStep: InstallStepAbstract
    locale: string
}

export class InstallStepper {
	public id: string;
    private steps: InstallStepAbstract[] = [];
    public context: any = {};
    public readonly canBeClosed: boolean;
    public static instances: InstallStepper[] = [];

    constructor(id: string, canBeClosed: boolean = false) {
		this.id = id;
        this.canBeClosed = canBeClosed;
    }

	public static addStepper(stepper?: InstallStepper) {
		if (this.instances.find(item => item.id === stepper.id)) {
			adminizer.log.debug(`Stepper with id ${stepper.id} was deleted due to creating new one`);
			this.deleteStepper(stepper.id);
		}
		this.instances.push(stepper);
	}

    public static getStepper(stepperId: string): InstallStepper {
        return this.instances.find(item => item.id === stepperId);
    }

    public static deleteStepper(stepperId: string) {
		let stepper = this.getStepper(stepperId);
		if (!stepper.canBeClosed) {
            adminizer.log.error(`Can not delete stepper: Stepper with id ${stepperId} can not be closed.`);
			throw `Can not delete stepper: Stepper with id ${stepperId} can not be closed`
		}

        const index = this.instances.findIndex(item => item.id === stepperId);

		if (index !== -1) {
            this.instances.splice(index, 1);
            adminizer.log.info(`Stepper with id ${stepperId} has been deleted.`);
        } else {
            adminizer.log.error(`Can not delete stepper: Stepper with id ${stepperId} not found.`);
            throw `Can not delete stepper: Stepper with id ${stepperId} not found.`
        }
    }

	public static getInstance(): InstallStepper {
		if (!this.instances.length) {
            let newStepper = new InstallStepper("project", false);
            this.instances.push(newStepper);
		}

        return this.instances.find(item => item.id === "project");
	}

    public getSteps(): InstallStepAbstract[] {
        return this.steps;
    }

    public async processStep(stepId: string, data: any) {
        try {
            /** As we sort steps by sortOrder, we should check that previous steps were processed */
            const stepIndex = this.steps.findIndex(item => item.id === stepId)
            adminizer.log.debug("STEP INDEX", stepIndex);
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

            // get context copy and write down information in it on process without damaging source object
            let contextCopy = { ...this.context };
            await step.process(data, contextCopy);
            Object.assign(this.context, contextCopy);

            step.isProcessed = true;
            adminizer.log.debug(`STEP ${stepId} was processed`);

            // call finalize method only if has description
            if (step.finallyToRun) {
                contextCopy = { ...this.context };
                step.toFinally(data, this.context)
                Object.assign(this.context, contextCopy);
            }

        } catch (e) {
            adminizer.log.error(`Error processing step: ${e}`);
            throw new Error(e);
        }
    }

    private getStepById(stepId: string): InstallStepAbstract {
        return this.steps.find(item => item.id === stepId);
    }

    /** Prepares steps array for user interface render */
    public render(locale: string): RenderData {
        let stepToRender = this.getNextUnprocessedStep();
        let leftSteps = this.steps.filter(step => !step.isProcessed && !step.isSkipped);

        // set locale
        if (typeof adminizer.config.translation !== "boolean") {
            if (!locale || !adminizer.config.translation.locales.includes(locale)) {
                locale = adminizer.config.translation.defaultLocale || "en";
            }
        } else {
            locale = "en";
        }

        this.context.locale = locale;

        // translate step
        stepToRender = TranslationHelper.translateProperties(stepToRender, locale, ["title", "description", "name"]);

        return {
            totalStepCount: this.steps.length,
            leftStepsCount: leftSteps.length,
            currentStep: stepToRender,
            locale: locale
        };
    }

    public async skipStep(stepId: string) {
        try {
            let step = this.getStepById(stepId);
            await step.skipIt();
            step.isSkipped = true;

        } catch (e) {
            adminizer.log.error(`Error skipping step: ${e}`);
        }
    }

    /** Add step (replace if it already exists) */
    public addStep(step: InstallStepAbstract) {
        if (step.renderer === "ejs") {
            if (!step.ejsPath || !fs.existsSync(step.ejsPath)) {
                throw `Step [${step.title}] error: ejs path does not exists`
            }
        }

        const stepIndex = this.steps.findIndex(item => item.id === step.id)
        if (stepIndex !== -1) {
            adminizer.log.warn(`Attention! The step has been replaced\`${step.id}\``)
            this.steps[stepIndex] = step;

        } else {
            this.steps.push(step);
        }

        // sort by group, then by renderer and then by sortOrder
        this.steps.sort((a, b) => {
            if (a.groupSortOrder !== b.groupSortOrder) {
                return a.groupSortOrder - b.groupSortOrder;
            } else {
                if (a.renderer !== b.renderer) {
                    return a.renderer === 'ejs' ? -1 : 1;
                } else {
                    return a.sortOrder - b.sortOrder;
                }
            }
        });

    }

    public hasUnprocessedSteps(): boolean {
        return this.steps.some(step => !step.isProcessed && !step.isSkipped);
    }

    public getNextUnprocessedStep(): InstallStepAbstract {
        let nextStep = this.steps.find(step => !step.isProcessed && !step.isSkipped);
        if (!nextStep && this.hasUnfinalizedSteps()) {
            if (this.getStepById("finalize")) {
                nextStep = this.getStepById("finalize")

            } else {
                let timer = setInterval(() => {

                    // clear steps if all of them was processed and finalized
                    if (!this.hasUnprocessedSteps() && !this.hasUnfinalizedSteps()) {
                        this.steps = []
                        adminizer.log.debug("CLEARING STEPS", this.steps)
                        clearInterval(timer);
                    }
                }, 5000)

                nextStep = new FinalizeStep();
                this.addStep(nextStep);
            }
        }

        return nextStep;
    }

    public hasUnfinalizedSteps(): boolean {
        return this.steps.some(step => step.finallyPromise?.status === "pending");
    }

    public getFinalizeStatus() {
        let stepsWithFinalize = this.steps.filter(step => step.finallyPromise !== null);
        let generalStatus = "fulfilled";
        let stepFinalizeStatuses = stepsWithFinalize.map(item => {
            let info: string = null
            // if one of them is pending, general status is pending
            if (item.finallyPromise.status === "pending") {
                generalStatus = "pending";
            }
            if (item.finallyPromise.status === "rejected") {
                generalStatus = "rejected";
                info = `Error: ${item.finallyPromise.info}`
            }

            return { id: item.id, status: item.finallyPromise.status, description: item.finallyDescription, info: info }
        })

        return { status: generalStatus, finalizeList: stepFinalizeStatuses ?? [] };
    }
}
