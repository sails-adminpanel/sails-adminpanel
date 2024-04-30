import _login from "../controllers/login";
import _initUser from "../controllers/initUser";

import {AdminpanelConfig} from "../interfaces/adminpanelConfig";
import bindPolicies from "../lib/bindPolicies"

export default async function bindAuthorization() {

    let admins;
    try {
        admins = await UserAP.find({isAdministrator: true});
    } catch (e) {
        sails.log.error("Error trying to find administrator", e)
        return;
    }


    /**
     * Router
     */
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/model/:entity';


    let adminsCredentials = [];
    // if we have administrator profiles
    let config: AdminpanelConfig = sails.config.adminpanel;

    if (admins && admins.length) {
        for (let admin of admins) {
            adminsCredentials.push({
                fullName: admin.fullName,
                login: admin.login,
                password: admin.password
            })
        }

        sails.log.debug(`Has Administrators with login [${adminsCredentials[0].login}]`)

    } else if(process.env.ADMINPANEL_LAZY_GEN_ADMIN_DISABLE === undefined ) {
        let adminData;

        if (config.administrator && config.administrator.login && config.administrator.password) {
            adminData = config.administrator;
        } else {
            let password = getRandomInt(1000000000000, 9999999999999)
            adminData = {
                login: "admin",
                password: `${password}`
            }
        }

        try {
            await UserAP.create({login: adminData.login, password: adminData.password, fullName: "Administrator",
                isActive: true, isAdministrator: true});
        } catch (e) {
            sails.log.error("Could not create administrator profile", e)
            return;
        }

        console.group("Administrators credentials")
        console.table(adminsCredentials);
        console.groupEnd()

    } else { // try to create one if we don't
        if (sails.config.adminpanel.auth) {
            sails.log.debug(`Adminpanel does not have an administrator`)
            sails.config.adminpanel.policies.push(initUserPolicy)
            sails.router.bind(sails.config.adminpanel.routePrefix + '/init_user', _initUser);
        }
    }

    if (sails.config.adminpanel.auth) {
        sails.router.bind(baseRoute + '/login', bindPolicies(policies, _login));
        sails.router.bind(baseRoute + '/logout', bindPolicies(policies, _login));
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


async function initUserPolicy (req: ReqType, res: ResType, proceed: any) {
    let admins = await UserAP.find({isAdministrator: true});
    if(!admins.length){
        return res.redirect(`${sails.config.adminpanel.routePrefix}/init_user`)
    }
    return proceed()
}
