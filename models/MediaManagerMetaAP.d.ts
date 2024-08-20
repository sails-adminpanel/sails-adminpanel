import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly key: {
        readonly type: "string";
    };
    readonly value: {
        readonly type: "string";
    };
    readonly parent: {
        readonly model: "MediaManagerAP";
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
interface MediaManagerMetaAP extends Partial<ModelOptions> {
}
export default MediaManagerMetaAP;
declare const model: {
    beforeCreate(record: MediaManagerMetaAP, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "string";
            readonly allowNull: false;
        };
        readonly key: {
            readonly type: "string";
        };
        readonly value: {
            readonly type: "string";
        };
        readonly parent: {
            readonly model: "MediaManagerAP";
        };
    };
};
declare global {
    const MediaManagerMetaAP: Model<typeof model>;
    interface Models {
        MediaManagerMetaAP: MediaManagerMetaAP;
    }
}
