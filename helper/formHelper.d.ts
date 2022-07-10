export declare class FormHelper {
    private static _forms;
    static update(slug: string, data: object): Promise<void>;
    static get(slug: string): Promise<object>;
    static loadForms(formsPath: string): void;
    static updateFormFile(formsPath: string, slug: string, data: object): void;
}
