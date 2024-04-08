import InstallStepAbstract from "./InstallStepAbstract";

export default class FinalizeStep extends InstallStepAbstract {
    canBeSkipped = false;
    description = '';
    ejsPath = `${sails.config.adminpanel.pathToViews}/ejs/installer/finalize.ejs`;
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
        this.isProcessed = true;
    }

    async skip() {
        this.isProcessed = true;
    }

    finally() {
        return Promise.resolve(undefined);
    }
}
