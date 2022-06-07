"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const requestProcessor_1 = require("../lib/requestProcessor");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function edit(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    if (!instance.config.edit) {
        return res.redirect(instance.uri);
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let record;
    try {
        record = await instance.model.findOne(req.param('id')).populateAll();
    }
    catch (e) {
        req._sails.log.error('Admin edit error: ');
        req._sails.log.error(e);
        return res.serverError();
    }
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'edit');
    let reloadNeeded = false;
    fields = await fieldsHelper_1.FieldsHelper.loadAssociations(fields);
    if (req.method.toUpperCase() === 'POST') {
        let reqData = requestProcessor_1.RequestProcessor.processRequest(req, fields);
        let params = {};
        params[instance.config.identifierField || req._sails.config.adminpanel.identifierField] = req.param('id');
        for (let prop in reqData) {
            if (Number.isNaN(reqData[prop]) || reqData[prop] === undefined || reqData[prop] === null) {
                delete reqData[prop];
            }
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
                try {
                    reqData[prop] = JSON.parse(reqData[prop]);
                }
                catch (e) {
                    if (typeof reqData[prop] === "string" && reqData[prop].replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                        sails.log.error(JSON.stringify(reqData[prop]), e);
                    }
                }
            }
        }
        // callback before save instance
        let instanceEdit = instance.config.edit;
        if (typeof instanceEdit.instanceModifier === "function") {
            reqData = instanceEdit.instanceModifier(reqData);
        }
        try {
            let newRecord = await instance.model.update(params, reqData).fetch();
            sails.log(`Record was updated: `, newRecord);
            req.session.messages.adminSuccess.push('Your record was updated !');
            reloadNeeded = true;
        }
        catch (e) {
            req._sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
            return e;
        }
    }
    if (reloadNeeded) {
        try {
            record = await instance.model.findOne(req.param('id')).populateAll();
        }
        catch (e) {
            req._sails.log.error('Admin edit error: ');
            req._sails.log.error(e);
            return res.serverError();
        }
    }
    res.viewAdmin({
        instance: instance,
        record: record,
        fields: fields
    });
}
exports.default = edit;
;
