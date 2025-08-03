import { MediaManagerAssociationsAP } from "./MediaManagerAssociationsAP";
import { MediaManagerMetaAP } from "./MediaManagerMetaAP";
declare const _default: {
    id: {
        type: string;
        allowNull: boolean;
        uuid: boolean;
        primaryKey: boolean;
        required: boolean;
    };
    parent: {
        model: string;
    };
    variants: {
        collection: string;
        via: string;
    };
    mimeType: {
        type: string;
    };
    path: {
        type: string;
    };
    size: {
        type: string;
    };
    group: {
        type: string;
    };
    tag: {
        type: string;
    };
    url: {
        type: string;
    };
    filename: {
        type: string;
    };
    meta: {
        collection: string;
        via: string;
    };
    modelAssociation: {
        collection: string;
        via: string;
    };
};
export default _default;
export interface MediaManagerAP {
    id: string;
    parent?: MediaManagerAP;
    variants?: MediaManagerAP[];
    mimeType?: string;
    path?: string;
    size?: number;
    group?: string;
    tag?: string;
    url?: string;
    filename?: string;
    meta?: MediaManagerMetaAP[];
    modelAssociation?: MediaManagerAssociationsAP[];
}
