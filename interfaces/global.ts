import sails from "sails-typescript";
import { AdminpanelConfig } from "./adminpanelConfig";
import UserAP from "../models/UserAP";
type sailsConfig = typeof sails.config;

type reqSession = {
  UserAP: UserAP
  messages:  {
    adminError: string[],
    adminSuccess: string[]
  }
  adminPretender?: UserAP
}


declare global {
  interface Sails extends sails.Sails {
    helpers: any;
    models: any;
    services: any;
    config: _sailsConfig;
    log: any;
    getDatastore: Function
  }
  interface _sailsConfig extends sailsConfig {
    adminpanel: AdminpanelConfig;
    [key: string]: any | object;
  }
  const sails: Sails;
  type ReqType = sails.Request & {session: reqSession} ;
  type ResType = sails.Response & { 
    viewAdmin<T>(variables: T): void
    viewAdmin<T>(template: string, variables: T): void 
  };
  type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
}
