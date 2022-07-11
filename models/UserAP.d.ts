/**
 * User.ts
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineEntity";
import GroupAP from "./GroupAP";
declare let attributes: {
    id: {
        type: string;
        autoIncrement: boolean;
    };
    login: string;
    fullName: string;
    email: string;
    passwordHashed: string;
    timezone: string;
    expires: string;
    locale: string;
    isDeleted: boolean;
    isActive: boolean;
    isAdministrator: boolean;
    groups: GroupAP[];
};
declare type attributes = typeof attributes & WaterlineEntity;
interface UserAP extends attributes {
}
export default UserAP;
declare let model: {
    beforeCreate: (values: any, next: any) => any;
    beforeUpdate: (values: any, next: any) => any;
};
declare global {
    const UserAP: typeof model & WaterlineModel<UserAP>;
}
