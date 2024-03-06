import sails from "@42pub/typed-sails";
import { AdminpanelConfig } from "./adminpanelConfig";
declare type sailsConfig = typeof sails.config;
declare global {
    interface Sails extends sails.Sails {
        helpers: any;
        models: any;
        services: any;
        config: _sailsConfig;
        log: any;
        getDatastore: Function;
    }
    interface _sailsConfig extends sailsConfig {
        adminpanel: AdminpanelConfig;
        [key: string]: any | object;
    }
    const sails: Sails;
    type ReqType = sails.Request;
    type ResType = sails.Response;
    type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
}
export {};
