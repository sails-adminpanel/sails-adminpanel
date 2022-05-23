"use strict";
// 1. Если не установлена auth = true, то все пользователи superadmin и модель создавать не нужно
// 2. 2 модели (пользователя и группы), в оперативке список всех флагов разрешений, настройка внутри модели группы
// что может делать группы по этому флагу, суперадмину проверка не нужна
// 3. Как только найдено первый флаг разрешений у группы этого пользователя, то разрешено
// 4. Сделать извне методы добавляющие флаги разрешений с возможностью их группировать
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../controllers/login");
let superAdmin = 'isAdminpanelSuperAdmin';
module.exports = async function bindAuthorization() {
    let config = sails.config.adminpanel;
    let adminData;
    if (config.administrator) {
        adminData = config.administrator;
    }
    else {
        adminData = {
            login: "engineer",
            password: "engineer"
        };
    }
    try {
        let administrator = await UserAP.findOne({ login: adminData.login, isAdministrator: true });
        if (!administrator) {
            await UserAP.destroy({ isAdministrator: true });
            await UserAP.create({ login: adminData.login, password: adminData.password, fullName: "Administrator",
                isActive: true, isAdministrator: true });
        }
    }
    catch (e) {
        sails.log.error("Could not create administrator profile", e);
        return;
    }
    console.log(`\n### Administrator:\n###\tlogin: ${adminData.login}\n###\tpassword: ${adminData.password}\n`);
    /**
     * Router
     */
    let _bindPolicies = require('../lib/bindPolicies').default();
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
    sails.router.bind(baseRoute + '/login', _bindPolicies(policies, login_1.default));
    sails.router.bind(baseRoute + '/logout', _bindPolicies(policies, login_1.default));
    let apConfName = ['list', 'add', 'edit', 'remove', 'view'];
    var apConf = {
        title: 'Users',
        model: 'UserAP',
        icon: 'user',
        permission: superAdmin
    };
    for (var i in apConfName) {
        var conf = {
            permission: superAdmin
        };
        if (apConfName[i] !== 'remove') {
            conf.fields = {
                id: true,
                passwordHashed: false,
                createdAt: false,
                updatedAt: false,
                permission: {
                    widget: 'JsonEditor',
                    JsonEditor: {
                        height: 100,
                        mode: 'tree',
                        modes: ['code', 'form', 'text', 'tree', 'view']
                    }
                },
                password: false
            };
        }
        if (apConfName[i] === 'add') {
            conf.fields.password = true;
        }
        apConf[apConfName[i]] = conf;
    }
    sails.config.adminpanel.instances['userap'] = apConf;
};
/**
 * Add method to check permission from controller
 */
sails.adminpanel = {};
sails.adminpanel.havePermission = (req, obj, action) => {
    return true;
};
sails.on('lifted', async function () {
    /**
     * Model
     */
    var conf;
    // Only in dev mode after drop
    if (sails.config.models.migrate !== 'drop')
        return;
    if (sails.config.adminpanel.admin) {
        conf = sails.config.adminpanel.admin;
    }
    else {
        var conf = {
            username: 'engineer',
            password: 'engineer'
        };
    }
    try {
        let user = await UserAP.findOne({ username: conf.username });
        if (!user) {
            user = await UserAP.create({
                username: conf.username,
                password: conf.password,
                permission: [superAdmin]
            }).fetch();
            if (!user)
                sails.log.error("Can't create user!");
        }
    }
    catch (e) {
        sails.log.error(e);
    }
});
