import { AdminpanelConfig } from "../../../interfaces/adminpanelConfig";

export class Adminizer {
    private _config: AdminpanelConfig;

    constructor(config: AdminpanelConfig) {
      if (Object.keys(this._config).length > 0) {
          throw new Error("Config has already been initialized");
      }
      this._config = config;
    }

    public get config(): AdminpanelConfig {
        return this._config;
    }
}
