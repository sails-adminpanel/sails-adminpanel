"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../controllers/login");
async function bindAuthorization() {
    let config = sails.config.adminpanel;
    let adminData;
    if (config.administrator) {
        adminData = config.administrator;
    }
    else {
        let password = getRandomInt(1000000000000, 9999999999999);
        adminData = {
            login: "admin",
            password: `${password}`
        };
    }
    // This code is only for single administrator, should be rewritten for multiple
    try {
        await UserAP.destroy({ isAdministrator: true });
        await UserAP.create({ login: adminData.login, password: adminData.password, fullName: "Administrator",
            isActive: true, isAdministrator: true });
    }
    catch (e) {
        sails.log.error("Could not create administrator profile", e);
        return;
    }
    console.log(`\n### Administrator:\n###\tlogin: ${adminData.login}\n###\tpassword: ${adminData.password}\n`);
    // ------------------------------------------------------------------------------------------------
    /**
     * Router
     */
    let _bindPolicies = require('../lib/bindPolicies').default();
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
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
