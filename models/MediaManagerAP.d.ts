import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly parent: {
        readonly model: "MediaManagerAP";
    };
    readonly children: {
        readonly collection: "MediaManagerAP";
        readonly via: "parent";
    };
    readonly mimeType: {
        readonly type: "string";
    };
    readonly path: {
        readonly type: "string";
    };
    readonly size: {
        readonly type: "number";
    };
    readonly image_size: {
        readonly type: "json";
    };
    readonly cropType: {
        readonly type: "string";
    };
    readonly url: {
        readonly type: "string";
    };
    readonly filename: {
        readonly type: "string";
    };
    readonly meta: {
        readonly model: "MediaManagerMetaAP";
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
        readonly parent: {
            readonly model: "MediaManagerAP";
        };
        readonly children: {
            readonly collection: "MediaManagerAP";
            readonly via: "parent";
        };
        readonly mimeType: {
            readonly type: "string";
        };
        readonly path: {
            readonly type: "string";
        };
        readonly size: {
            readonly type: "number";
        };
        readonly image_size: {
            readonly type: "json";
        };
        readonly cropType: {
            readonly type: "string";
        };
        readonly url: {
            readonly type: "string";
        };
        readonly filename: {
            readonly type: "string";
        };
        readonly meta: {
            readonly model: "MediaManagerMetaAP";
        };
    };
};
declare global {
    const MediaManagerAP: Model<typeof model>;
    interface Models {
        MediaManagerAP: MediaManagerAP;
    }
}
