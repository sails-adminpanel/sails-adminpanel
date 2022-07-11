"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../controllers/login");
async function bindAuthorization() {
    let admins;
    try {
        admins = await UserAP.find({ isAdministrator: true });
    }
    catch (e) {
        sails.log.error("Error trying to find administrator", e);
        return;
    }
    let adminsCredentials = [];
    // if we have administrator profiles
    if (admins && admins.length) {
        for (let admin of admins) {
            adminsCredentials.push({
                fullName: admin.fullName,
                login: admin.login,
                password: admin.password
            });
        }
    }
    else { // try to create one if we don't
        let config = sails.config.adminpanel;
        let adminData;
        if (config.administrator && config.administrator.login && config.administrator.password) {
            adminData = config.administrator;
        }
        else {
            let password = getRandomInt(1000000000000, 9999999999999);
            adminData = {
                login: "admin",
                password: `${password}`
            };
        }
        try {
            await UserAP.create({ login: adminData.login, password: adminData.password, fullName: "Administrator",
                isActive: true, isAdministrator: true });
        }
        catch (e) {
            sails.log.error("Could not create administrator profile", e);
            return;
        }
        adminsCredentials.push(adminData);
    }
    console.log("------------------------------------------------------------");
    console.group("Administrators credentials");
    console.table(adminsCredentials);
    console.groupEnd();
    console.log('-------------------------------------------------------------');
    // ------------------------------------------------------------------------------------------------
    /**
     * Router
     */
    let _bindPolicies = require('../lib/bindPolicies').default();
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/:entity';
    sails.router.bind(baseRoute + '/login', _bindPolicies(policies, login_1.default));
    sails.router.bind(baseRoute + '/logout', _bindPolicies(policies, login_1.default));
}
exports.default = bindAuthorization;
;
sails.on('lifted', async function () {
    // Only in dev mode after drop
    if (sails.config.models.migrate !== 'drop')
        return;
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}
