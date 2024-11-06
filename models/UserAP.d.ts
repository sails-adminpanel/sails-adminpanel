import { ModelTypeDetection, Model } from "sails-typescript";
import { WidgetConfig } from "../lib/widgets/widgetHandler";
declare const attributes: {
    readonly id: {
        readonly type: "number";
        readonly autoIncrement: true;
    };
    readonly login: {
        readonly type: "string";
        readonly required: true;
        readonly unique: true;
    };
    readonly fullName: {
        readonly type: "string";
        readonly required: true;
    };
    readonly email: {
        readonly type: "string";
    };
    readonly passwordHashed: {
        readonly type: "string";
    };
    readonly password: {
        readonly type: "string";
    };
    readonly timezone: {
        readonly type: "string";
    };
    readonly expires: {
        readonly type: "string";
    };
    readonly locale: {
        readonly type: "string";
    };
    readonly isDeleted: {
        readonly type: "boolean";
    };
    readonly isActive: {
        readonly type: "boolean";
    };
    readonly isAdministrator: {
        readonly type: "boolean";
    };
    readonly groups: {
        readonly collection: "GroupAP";
        readonly via: "users";
    };
    readonly widgets: {
        readonly type: "json";
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
export interface UserAPRecord extends Partial<ModelOptions> {
}
declare const model: {
    beforeCreate(values: UserAPRecord, cb: (err?: Error | string) => void): void;
    beforeUpdate(values: UserAPRecord, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "number";
            readonly autoIncrement: true;
        };
        readonly login: {
            readonly type: "string";
            readonly required: true;
            readonly unique: true;
        };
        readonly fullName: {
            readonly type: "string";
            readonly required: true;
        };
        readonly email: {
            readonly type: "string";
        };
        readonly passwordHashed: {
            readonly type: "string";
        };
        readonly password: {
            readonly type: "string";
        };
        readonly timezone: {
            readonly type: "string";
        };
        readonly expires: {
            readonly type: "string";
        };
        readonly locale: {
            readonly type: "string";
        };
        readonly isDeleted: {
            readonly type: "boolean";
        };
        readonly isActive: {
            readonly type: "boolean";
        };
        readonly isAdministrator: {
            readonly type: "boolean";
        };
        readonly groups: {
            readonly collection: "GroupAP";
            readonly via: "users";
        };
        readonly widgets: {
            readonly type: "json";
        };
    };
};
declare global {
    const UserAP: Model<typeof model>;
    interface Models {
        UserAP: UserAPRecord;
    }
    interface AppCustomJsonTypes {
        widgets: WidgetConfig[];
    }
}
export {};
