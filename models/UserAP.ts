/**
 * User.ts
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineORM";
import GroupAP from "./GroupAP";

let passwordHash = require('password-hash');

let attributes = {

    id: {
        type: 'number',
        autoIncrement: true
    },
    login: {
        type: 'string',
        required: true,
        unique: true
    } as unknown as string,
    fullName: {
        type: 'string',
        required: true
    } as unknown as string,
    email: "string",
    passwordHashed: 'string',
    password: 'string',
    timezone: "string",
    expires: "string",
    locale: "string",
    isDeleted: "boolean" as unknown as boolean,
    isActive: "boolean" as unknown as boolean,
    isAdministrator: "boolean" as unknown as boolean,
    groups: {
        collection: "groupap",
        via: "users"
    } as unknown as GroupAP[]

};

type attributes = typeof attributes & WaterlineEntity;
interface UserAP extends attributes {}
export default UserAP;

let model = {
    beforeCreate: (values, next) => {
        values.passwordHashed = passwordHash.generate(values.login + values.password);
        values.password = 'masked';
        return next();
    },

    beforeUpdate: (values, next) => {
        if (values.password) {
            values.passwordHashed = passwordHash.generate(values.login + values.password);
            values.password = 'masked';
        }
        return next();
    }

    /** ... Any model methods here ... */

};

module.exports = {
    primaryKey: "id",
    attributes: attributes,
    ...model,
};

declare global {
    const UserAP: typeof model & WaterlineModel<UserAP>;
}

