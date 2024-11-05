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
export interface GroupAPRecord extends Partial<ModelOptions> {
}
declare const model: {
    beforeCreate(record: GroupAPRecord, cb: (err?: Error | string) => void): void;
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
        GroupAP: GroupAPRecord;
    }
    interface AppCustomJsonTypes {
        tokens: string[];
    }
}
export {};
