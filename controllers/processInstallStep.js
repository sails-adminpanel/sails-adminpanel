"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function processInstallStep(req, res) {
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`process-install-step`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    console.log("REQ", req.query);
    // TODO добавить сеттинги в модулях вместо сидов на bootstrap, они должны писаться в базу и из них должен рендериться степпер.
    //  Сделать нужно это в нескольких модулях и в каждом по нескольку настроек разных типов
    // TODO раз это универсальный контроллер, то в req.query уже должна приходить правильная структура данных,
    //  в данном случае это setting или массив setting
    // await InstallStepper.processStep()
    // TODO data должна выгладеть как setting или массив setting
    // async process(data: any): Promise<void> {
    // 	if (Array.isArray(data)) {
    // 	for (let _setting of data) {
    // 		let setting = _setting as Settings;
    // 		await Settings.update({id: setting.id}, {value: setting.value});
    // 	}
    // } else {
    // 	await Settings.update({id: data.id}, {value: data.value});
    // }
    // TODO здесь выполнять processStep
    // TODO во вью добавить инпут с кнопкой и post запрос сюда, который вернет данные сюда и будет вызван processStep
}
exports.default = processInstallStep;
;
