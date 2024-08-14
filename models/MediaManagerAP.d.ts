import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly parentId: {
        readonly model: "MediaManagerAP";
    };
    readonly mimeType: {
        readonly type: "string";
    };
    readonly size: {
        readonly type: "string";
    };
    readonly date: {
        readonly type: "string";
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
interface MediaManagerAP extends Partial<ModelOptions> {
}
export default MediaManagerAP;
declare const model: {
    beforeCreate(record: MediaManagerAP, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "string";
            readonly allowNull: false;
        };
        readonly parentId: {
            readonly model: "MediaManagerAP";
        };
        readonly mimeType: {
            readonly type: "string";
        };
        readonly size: {
            readonly type: "string";
        };
        readonly date: {
            readonly type: "string";
        };
    };
};
declare global {
    const MediaManagerAP: Model<typeof model>;
    interface Models {
        MediaManagerAP: MediaManagerAP;
    }
}
