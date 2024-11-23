import { AdminpanelConfig } from "../../../interfaces/adminpanelConfig";
export declare class Adminizer {
    private _config;
    constructor();
    init(config: AdminpanelConfig): void;
    get config(): AdminpanelConfig;
    get log(): {
        info: (...args: any[]) => any;
        warn: (...args: any[]) => any;
        error: (...args: any[]) => any;
        debug: (...args: any[]) => any;
        silly: (...args: any[]) => any;
    };
}
