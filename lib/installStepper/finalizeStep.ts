import InstallStepAbstract from "./InstallStepAbstract";
import * as path from "path";
import {InstallStepper} from "./installStepper";

export default class FinalizeStep extends InstallStepAbstract {
    canBeSkipped = false;
    description = '';
    ejsPath = path.resolve(__dirname, '../../views/ejs/installer/partials/finalize.ejs');
    id = 'finalize';
    scriptsUrl = '';
    sortOrder = 0;
    stylesUrl = '';
    title = 'Finalize Step';
    badge = '';
    isSkipped = false;
    settingsKeys = [];
    renderer: "ejs" = "ejs";
    isProcessed = false;

    async check() {
        return this.isProcessed;
    }

    async process(data) {
        if (!InstallStepper.hasUnfinalizedSteps()) {
            this.isProcessed = true;
        }
    }

    async skip() {
        if (!InstallStepper.hasUnfinalizedSteps()) {
            this.isProcessed = true;
        }
    }

    finally(): Promise<void> {
        return;
    }

    toFinally() {
        return;
    }
}
