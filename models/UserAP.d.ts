import { GroupAP } from "./GroupAP";
declare const _default: {
    id: {
        type: string;
        autoIncrement: boolean;
        primaryKey: boolean;
    };
    login: {
        type: string;
        required: boolean;
        unique: boolean;
    };
    fullName: {
        type: string;
        required: boolean;
    };
    email: {
        type: string;
    };
    avatar: {
        type: string;
    };
    passwordHashed: {
        type: string;
    };
    timezone: {
        type: string;
    };
    expires: {
        type: string;
    };
    locale: {
        type: string;
    };
    isDeleted: {
        type: string;
    };
    isActive: {
        type: string;
    };
    isAdministrator: {
        type: string;
    };
    groups: {
        collection: string;
        via: string;
    };
    widgets: {
        type: string;
    };
    isConfirmed: {
        type: string;
    };
};
export default _default;
export interface UserAP {
    id: number;
    login: string;
    fullName?: string;
    email?: string;
    avatar?: string;
    passwordHashed?: string;
    timezone?: string;
    expires?: string;
    locale?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    isAdministrator?: boolean;
    groups?: GroupAP[];
    widgets?: {
        widgets: any;
        layout: any;
    };
    isConfirmed?: boolean;
}
