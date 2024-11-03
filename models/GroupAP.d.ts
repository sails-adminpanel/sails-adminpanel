import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "number";
        readonly autoIncrement: true;
    };
    readonly name: {
        readonly type: "string";
        readonly required: true;
        readonly unique: true;
    };
    readonly description: {
        readonly type: "string";
    };
    readonly tokens: {
        readonly type: "json";
    };
    readonly users: {
        readonly collection: "UserAP";
        readonly via: "groups";
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
interface GroupAP extends Partial<ModelOptions> {
}
export default GroupAP;
declare const model: {
    beforeCreate(record: GroupAP, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "number";
            readonly autoIncrement: true;
        };
        readonly name: {
            readonly type: "string";
            readonly required: true;
            readonly unique: true;
        };
        readonly description: {
            readonly type: "string";
        };
        readonly tokens: {
            readonly type: "json";
        };
        readonly users: {
            readonly collection: "UserAP";
            readonly via: "groups";
        };
    };
};
declare global {
    const GroupAP: Model<typeof model>;
    interface Models {
        GroupAP: GroupAP;
    }
    interface AppCustomJsonTypes {
        tokens: string[];
    }
}
