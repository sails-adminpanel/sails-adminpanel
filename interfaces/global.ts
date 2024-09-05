import sails from "sails-typescript";
import {AdminpanelConfig} from "./adminpanelConfig";
import UserAP from "../models/UserAP";

type sailsConfig = typeof sails.config;

type reqSession = {
	UserAP: UserAP
	messages: {
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
		getDatastore: () => {
			config: {
				adapter: string
			}
		}
	}

	interface _sailsConfig extends sailsConfig {
		adminpanel: AdminpanelConfig;

		[key: string]: any | object;
	}

	const sails: Sails;
	type ReqType = sails.Request & {
		session: reqSession,
		_parsedUrl: {
			pathname: string
		}
		setLocale: (locale: string) => void
		route: {
			[key: string]: string
		}
	};
	type ResType = sails.Response & {
		viewAdmin<T>(variables: T): void
		viewAdmin<T>(template: string, variables: T): void
		/**
		 * @deprecated
		 * @param statusCode
		 */
		sendStatus(statusCode: number): Response;
	};
	type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
}
