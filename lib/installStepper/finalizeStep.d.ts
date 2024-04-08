import InstallStepAbstract from "./InstallStepAbstract";
export default class FinalizeStep extends InstallStepAbstract {
    canBeSkipped: boolean;
    description: string;
    ejsPath: string;
    id: string;
    scriptsUrl: string;
    sortOrder: number;
    stylesUrl: string;
    title: string;
    badge: string;
    isSkipped: boolean;
    settingsKeys: any[];
    renderer: "ejs";
    isProcessed: boolean;
    check(): Promise<boolean>;
    process(data: any): Promise<void>;
    skip(): Promise<void>;
    finally(): Promise<any>;
}
