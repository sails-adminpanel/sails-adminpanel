export declare class FormHelper {
    private static _forms;
    static get(slug: string): Promise<object>;
    static loadForms(formsPath: string): void;
}
