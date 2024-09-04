export declare class TranslationHelper {
    static loadTranslations(translationsPath: string): void;
    static translateProperties(object: any, locale: string, fields: string[]): any;
    private static getI18nInstance;
}
