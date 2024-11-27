import { AdminpanelConfig } from "../../../interfaces/adminpanelConfig";

export class Adminizer {
    private _config: AdminpanelConfig;

    constructor() {

    }

    public init(config: AdminpanelConfig) {
      if (this._config && Object.keys(this._config).length > 0) {
        throw new Error("Config has already been initialized");
    }
    this._config = config;
    }

    public get config(): AdminpanelConfig {
        return this._config;
    }

    public get log() {
      return {
          info: (...args: any[]) => sails.log.info(...args),
          warn: (...args: any[]) => sails.log.warn(...args),
          error: (...args: any[]) => sails.log.error(...args),
          debug: (...args: any[]) => sails.log.debug(...args),
          verbose: (...args: any[]) => sails.log.debug(...args),
          silly: (...args: any[]) => sails.log.silly(...args)
      };
    }
}
