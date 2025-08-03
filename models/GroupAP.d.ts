import { UserAP } from "./UserAP";
declare const _default: {
    id: {
        type: string;
        autoIncrement: boolean;
        primaryKey: boolean;
    };
    name: {
        type: string;
        required: boolean;
        unique: boolean;
    };
    description: {
        type: string;
    };
    tokens: {
        type: string;
    };
    users: {
        collection: string;
        via: string;
    };
};
export default _default;
export interface GroupAP {
    id: number;
    name: string;
    description?: string;
    tokens?: string[];
    users?: UserAP[];
}
