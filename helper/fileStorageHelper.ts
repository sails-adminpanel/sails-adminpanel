'use strict'
import * as fs from "fs";

export class FileStorageHelper {
    private static _storage = {};
    private static _filePath = ".tmp/adminpanel_file_storage.json";
    private static _isInitialized = false;

    public static _init(): void {
        if (fs.existsSync(`${process.cwd()}/${this._filePath}`)) {
            let rawStorage = fs.readFileSync(`${process.cwd()}/${this._filePath}`, "utf-8");
            try {
                this._storage = JSON.parse(rawStorage)
                this._isInitialized = true;
            } catch (e) {
                throw new Error("Couldn't read storage file: " + e)
            }
        }
    }

    public static get(slug: string, key: string): string {
        if (!this._isInitialized) {
            this._init();
        }

        if (this._storage[slug]) {
            return this._storage[slug][key]
        }
    }

    public static set(slug: string, key: string, value: string): void {
        if (!this._storage[slug]) {
            this._storage[slug] = {};
        }

        this._storage[slug][key] = value;
        fs.writeFileSync(this._filePath, JSON.stringify(this._storage))
    }
}
