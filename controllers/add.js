"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const requestProcessor_1 = require("../lib/requestProcessor");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const bindAuthorization_1 = require("../lib/bindAuthorization");
async function add(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    if (!instance.config.add) {
        return res.redirect(instance.uri);
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect("/admin/userap/login");
        }
        else if (!(0, bindAuthorization_1.havePermission)(`create-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'add');
    let data = {}; //list of field values
    fields = await fieldsHelper_1.FieldsHelper.loadAssociations(fields);
    if (req.method.toUpperCase() === 'POST') {
        let reqData = requestProcessor_1.RequestProcessor.processRequest(req, fields);
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
                        sails.log.error(e);
                    }
                }
            }
        }
        // callback before save instance
        let instanceAdd = instance.config.add;
        if (typeof instanceAdd.instanceModifier === "function") {
            reqData = instanceAdd.instanceModifier(reqData);
        }
        try {
            let record = await instance.model.create(reqData).fetch();
            sails.log(`A new record was created: `, record);
            req.flash('adminSuccess', 'Your record was created !');
        }
        catch (e) {
            sails.log.error(e);
            req.flash('adminError', e.message || 'Something went wrong...');
            data = reqData;
        }
    }
    return res.viewAdmin({
        instance: instance,
        fields: fields,
        data: data
    });
}
exports.default = add;
;
