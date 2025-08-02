'use strict';
const fs = require("fs");

class FileStorageHelper {
	static _storage = {};
	static _filePath = ".tmp/adminpanel_file_storage.json";
	static _isInitialized = false;

	static _init() {
		if (!fs.existsSync(`${process.cwd()}/.tmp`)) {
			fs.mkdirSync(`${process.cwd()}/.tmp`)
		}

		if (fs.existsSync(`${process.cwd()}/${this._filePath}`)) {
			let rawStorage = fs.readFileSync(`${process.cwd()}/${this._filePath}`, "utf-8");
			try {
				this._storage = JSON.parse(rawStorage);
				this._isInitialized = true;
			} catch (e) {
				throw new Error("Couldn't read storage file: " + e);
			}
		}
	}

	static get(slug, key) {
		if (!this._isInitialized) {
			this._init();
		}

		if (this._storage[slug]) {
			return this._storage[slug][key];
		} else {
			return undefined;
		}
	}

	static set(slug, key, value) {
		if (!this._storage[slug]) {
			this._storage[slug] = {};
		}

		this._storage[slug][key] = value;
		fs.writeFileSync(this._filePath, JSON.stringify(this._storage));
	}
}

module.exports = FileStorageHelper;
