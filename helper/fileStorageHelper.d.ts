export declare class FileStorageHelper {
    private static _storage;
    private static _filePath;
    private static _isInitialized;
    static _init(): void;
    static get(slug: string, key: string): string;
    static set(slug: string, key: string, value: string): void;
}
