import { MediaManagerAP } from "./MediaManagerAP";
declare const _default: {
    id: {
        type: string;
        allowNull: boolean;
        uuid: boolean;
        primaryKey: boolean;
        required: boolean;
    };
    key: {
        type: string;
    };
    value: {
        type: string;
    };
    isPublic: {
        type: string;
    };
    parent: {
        model: string;
    };
};
export default _default;
export interface MediaManagerMetaAP {
    id: string;
    key?: string;
    value?: Record<string, unknown>;
    isPublic?: boolean;
    parent?: MediaManagerAP;
}
