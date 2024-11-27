"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adminizer = void 0;
class Adminizer {
    constructor() {
    }
    init(config) {
        if (this._config && Object.keys(this._config).length > 0) {
            throw new Error("Config has already been initialized");
        }
        this._config = config;
    }
    get config() {
        return this._config;
    }
    get log() {
        return {
            info: (...args) => sails.log.info(...args),
            warn: (...args) => sails.log.warn(...args),
            error: (...args) => sails.log.error(...args),
            debug: (...args) => sails.log.debug(...args),
            verbose: (...args) => sails.log.debug(...args),
            silly: (...args) => sails.log.silly(...args)
        };
    }
}
exports.Adminizer = Adminizer;
