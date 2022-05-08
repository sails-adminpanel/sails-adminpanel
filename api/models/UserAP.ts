/**
 * User.ts
 *
 * @description :: User for authorization in adminpanel
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineInstance from "../interfaces/waterlineInstance";

let passwordHash = require('password-hash');

let attributes = {

    // id: {
    //     type:'integer',
    //     primaryKey: true,
    //     autoIncrement: true
    // },
    username: {
        type: 'string',
    },
    password: {
        type: 'string'
    },
    passwordHashed: {
        type: 'string'
    },
    permission: {
        type: 'json'
    }

};

type attributes = typeof attributes & WaterlineInstance;
interface UserAP extends attributes {}
export default UserAP;

let model = {
    beforeCreate: (values, next) => {
        values.passwordHashed = passwordHash.generate(values.username + values.password);
        values.password = '';
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

