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


// По умолчанию создается "administrator"
// Заменить вью группы и пользователя на создание и редактирование через конфиг

import * as path from "path";
import _login from "../controllers/login";
import {AdminpanelConfig} from "../interfaces/adminpanelConfig";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import UserAP from "../models/UserAP";

let superAdmin = 'isAdminpanelSuperAdmin';
export default async function bindAuthorization() {

    let config: AdminpanelConfig = sails.config.adminpanel;
    let adminData;
    if (config.administrator) {
        adminData = config.administrator;
    } else {
        let password = getRandomInt(1000000000000, 9999999999999)
        adminData = {
            login: "admin",
            password: `${password}`
        }
    }

    // This code is only for single administrator, should be rewritten for multiple
    try {
        await UserAP.destroy({isAdministrator: true});
        await UserAP.create({login: adminData.login, password: adminData.password, fullName: "Administrator",
            isActive: true, isAdministrator: true});
    } catch (e) {
        sails.log.error("Could not create administrator profile", e)
        return;
    }

    console.log(`\n### Administrator:\n###\tlogin: ${adminData.login}\n###\tpassword: ${adminData.password}\n`)

    // ------------------------------------------------------------------------------------------------

    /**
     * Router
     */
    let _bindPolicies = require('../lib/bindPolicies').default();
    let policies = sails.config.adminpanel.policies || '';
    let baseRoute = sails.config.adminpanel.routePrefix + '/:instance';
    sails.router.bind(baseRoute + '/login', _bindPolicies(policies, _login));
    sails.router.bind(baseRoute + '/logout', _bindPolicies(policies, _login));
};

sails.on('lifted', async function () {
    /**
     * Model
     */
    var conf;

    // Only in dev mode after drop
    if (sails.config.models.migrate !== 'drop') return;

});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}
