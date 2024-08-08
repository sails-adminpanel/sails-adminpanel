import { ModelTypeDetection, Model } from "sails-typescript";
import { WidgetConfig } from "sails-adminpanel/lib/widgets/widgetHandler";
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
interface UserAP extends Partial<ModelOptions> {
}
export default UserAP;
declare const model: {
    beforeCreate(values: UserAP, cb: (err?: string | Error) => void): void;
    beforeUpdate(values: UserAP, cb: (err?: string | Error) => void): void;
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
        UserAP: UserAP;
    }
    interface AppCustomJsonTypes {
        widgets: WidgetConfig[];
    }
}
