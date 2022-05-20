// 1. Если не установлена auth = true, то все пользователи superadmin и модель создавать не нужно
// 2. 2 модели (пользователя и группы), в оперативке список всех флагов разрешений, настройка внутри модели группы
// что может делать группы по этому флагу, суперадмину проверка не нужна
// 3. Как только найдено первый флаг разрешений у группы этого пользователя, то разрешено
// 4. Сделать извне методы добавляющие флаги разрешений с возможностью их группировать


// 1. У пользователя должен быть перманентный выбор локали
// 2. Нужно дать возможность разработчику переводить строки в своем проекте которые пойдут в админпанель
// 3. Если перевод не найден, то показывается оригинальный
// 4. Файлы переводов должны быть в config/locales/adminpanel [en, es, ru, fr]
// 5. Внутри конфига админпанели можно указать путь к этим переводам, и какие будут локали доступны
// 6. У админки будут свои переводы лежать и они будут мерджится с вышеуказанными переводами
// 7. Если пользователя нет, то выбирается дефолтная локаль из конфига. Если ее нет, то первая из списка локалей
// 8. Локаль достается из req.user
// 9. bindInternationalization на все /routePrefix/* будет навешивать этот middleware
// 10. In i18n-2/i18n.js should be appendLocale function
// 11. Проверять активность i18n и наличие метода appendLocale

import * as path from "path";
import _login from "../actions/login";

let superAdmin = 'isAdminpanelSuperAdmin';
module.exports = async function bindAuthorization() {
    /**
     * Router
     */
    let _bindPolicies = require('../lib/bindPolicies').default();
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
    sails.router.bind(baseRoute + '/login', _bindPolicies(policies, _login));
    sails.router.bind(baseRoute + '/logout', _bindPolicies(policies, _login));

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
            }
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
    action = path.basename(action).split('.')[0];
    if (!sails.config.adminpanel.auth)
        return true;
    if (action === '') {
        if (req.session.UserAP) {
            if (req.session.UserAP.permission) {
                if (!obj.permission) {
                    return true;
                }
            }
        }
    }
    if (req.session.UserAP) {
        if (req.session.UserAP.permission) {
            if (!Array.isArray(req.session.UserAP.permission)) {
                req.session.UserAP.permission = [req.session.UserAP.permission];
            }
            if (req.session.UserAP.permission.indexOf(superAdmin) >= 0) {
                return true;
            } else if (obj[action]) {
                if (typeof obj[action] === 'boolean')
                    return true;
                if (obj[action].permission) {
                    if (!Array.isArray(obj[action].permission)) {
                        obj[action].permission = [obj[action].permission];
                    }
                    for (var i in req.session.UserAP.permission) {
                        for (var j in obj[action].permission) {
                            if (req.session.UserAP.permission[i] === obj[action].permission[j]) {
                                return true;
                            }
                        }
                    }
                } else {
                    return true;
                }
            } else if (action === '') {
                if (obj.permission) {
                    if (!Array.isArray(obj.permission)) {
                        obj.permission = [obj.permission];
                    }
                    for (var i in req.session.UserAP.permission) {
                        for (var j in obj.permission) {
                            if (req.session.UserAP.permission[i] === obj.permission[j]) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}
sails.on('lifted', async function () {
    /**
     * Model
     */
    var conf;

    // Only in dev mode after drop
    if (sails.config.models.migrate !== 'drop') return;


    if (sails.config.adminpanel.admin) {
        conf = sails.config.adminpanel.admin;
    } else {
        var conf = {
            username: 'engineer',
            password: 'engineer'
        }
    }

    try {
        let user = await UserAP.findOne({username: conf.username})
        if (!user) {
            user = await UserAP.create({
                username: conf.username,
                password: conf.password,
                permission: [superAdmin]
            }).fetch()
            if (!user) sails.log.error("Can't create user!");
        }
    } catch (e) {
        sails.log.error(e);
    }

});
