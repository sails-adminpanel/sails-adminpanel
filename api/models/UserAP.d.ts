/**
 * User.ts
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineInstance from "../interfaces/waterlineInstance";
declare let attributes: {
    username: {
        type: string;
    };
    password: {
        type: string;
    };
    passwordHashed: {
        type: string;
    };
    permission: {
        type: string;
    };
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
