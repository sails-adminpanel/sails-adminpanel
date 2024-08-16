import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly author: {
        readonly type: "string";
    };
    readonly description: {
        readonly type: "string";
    };
    readonly title: {
        readonly type: "string";
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
        readonly author: {
            readonly type: "string";
        };
        readonly description: {
            readonly type: "string";
        };
        readonly title: {
            readonly type: "string";
        };
    };
};
declare global {
    const MediaManagerMetaAP: Model<typeof model>;
    interface Models {
        MediaManagerMetaAP: MediaManagerMetaAP;
    }
}
