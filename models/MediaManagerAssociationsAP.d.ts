import { MediaManagerAP } from "./MediaManagerAP";
declare const _default: {
    id: {
        type: string;
        allowNull: boolean;
        uuid: boolean;
        primaryKey: boolean;
        required: boolean;
    };
    mediaManagerId: {
        type: string;
    };
    model: {
        type: string;
    };
    modelId: {
        type: string;
    };
    widgetName: {
        type: string;
    };
    sortOrder: {
        type: string;
    };
    file: {
        model: string;
    };
};
export default _default;
export interface MediaManagerAssociationsAP {
    id: string;
    mediaManagerId?: string;
    model?: Record<string, unknown>;
    modelId?: Record<string, unknown>;
    widgetName?: string;
    sortOrder?: number;
    file?: MediaManagerAP;
}
