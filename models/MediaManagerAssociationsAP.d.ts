import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly mediaManagerId: {
        readonly type: "string";
    };
    readonly model: {
        readonly type: "json";
    };
    readonly modelId: {
        readonly type: "json";
    };
    readonly sortOrder: {
        readonly type: "number";
    };
    readonly file: {
        readonly model: "MediaManagerAP";
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
interface MediaManagerAssociationsAP extends Partial<ModelOptions> {
}
export default MediaManagerAssociationsAP;
declare const model: {
    beforeCreate(record: MediaManagerAssociationsAP, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "string";
            readonly allowNull: false;
        };
        readonly mediaManagerId: {
            readonly type: "string";
        };
        readonly model: {
            readonly type: "json";
        };
        readonly modelId: {
            readonly type: "json";
        };
        readonly sortOrder: {
            readonly type: "number";
        };
        readonly file: {
            readonly model: "MediaManagerAP";
        };
    };
};
declare global {
    const MediaManagerAssociationsAP: Model<typeof model>;
    interface Models {
        MediaManagerAssociationsAP: MediaManagerAssociationsAP;
    }
}
