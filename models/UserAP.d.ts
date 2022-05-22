/**
 * User.ts
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineInstance from "../interfaces/waterlineInstance";
import GroupAP from "./GroupAP";
declare let attributes: {
    id: {
        type: string;
        autoIncrement: boolean;
    };
    login: string;
    fullName: string;
    email: string;
    passwordHashed: {
        type: string;
    };
    timezone: string;
    expires: number;
    locale: string;
    isDeleted: boolean;
    isActive: boolean;
    groups: GroupAP[];
};
declare type attributes = typeof attributes & WaterlineInstance;
interface UserAP extends attributes {
}
export default UserAP;
declare let model: {
    beforeCreate: (values: any, next: any) => any;
};
declare global {
    const UserAP: typeof model & WaterlineModel<UserAP>;
}
