import { ModelTypeDetection, Model } from "sails-typescript";
declare const attributes: {
    readonly id: {
        readonly type: "string";
        readonly allowNull: false;
    };
    readonly label: {
        readonly type: "string";
        readonly required: true;
    };
    readonly tree: {
        readonly type: "json";
        readonly required: true;
    };
};
type ModelOptions = ModelTypeDetection<typeof attributes>;
interface NavigationAP extends Partial<ModelOptions> {
}
export default NavigationAP;
declare const model: {
    beforeCreate(record: NavigationAP, cb: (err?: Error | string) => void): void;
    primaryKey: string;
    attributes: {
        readonly id: {
            readonly type: "string";
            readonly allowNull: false;
        };
        readonly label: {
            readonly type: "string";
            readonly required: true;
        };
        readonly tree: {
            readonly type: "json";
            readonly required: true;
        };
    };
};
declare global {
    const NavigationAP: Model<typeof model>;
    interface Models {
        NavigationAP: NavigationAP;
    }
}
