"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const configHelper_1 = require("../helper/configHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
async function listJson(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${instance.name}-instance`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let records = [];
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'list');
    let query;
    try {
        // adminpanel design do not support list of more than 20000 lines per request
        // !TODO take off this limit
        query = instance.model.find().limit(20000);
    }
    catch (e) {
        sails.log.error(e);
    }
    fieldsHelper_1.FieldsHelper.getFieldsToPopulate(fields).forEach(function (val) {
        query.populate(val);
    });
    records = await waterlineExec(query);
    let identifierField = configHelper_1.ConfigHelper.getIdentifierField(instance.config.model);
    let keyFields = Object.keys(fields);
    let result = [];
    records.forEach((instance) => {
        let a = [];
        a.push(instance[identifierField]); // Push ID for Actions
        keyFields.forEach((key) => {
            let fieldData = "";
            let displayField = fields[key].config.displayField;
            if (fields[key].model.model) {
                if (!instance[key]) {
                    fieldData = "";
                }
                else {
                    // Model
                    fieldData = instance[key][displayField];
                }
            }
            else if (fields[key].model.collection) {
                if (!instance[key] || !instance[key].length) {
                    fieldData = "";
                }
                else {
                    // Collection
                    instance[key].forEach((item) => {
                        if (fieldData !== "")
                            fieldData += ", ";
                        fieldData += !item[displayField] ? item[fields[key].config.identifierField] : item[displayField];
                    });
                }
            }
            else {
                // Plain data
                fieldData = instance[key];
            }
            if (typeof fields[key].config.displayModifier === "function") {
                console.log("key", instance[key]);
                a.push(fields[key].config.displayModifier(instance[key]));
            }
            else {
                a.push(fieldData);
            }
        });
        result.push(a);
    });
    res.json({
        data: result
    });
}
exports.default = listJson;
;
async function waterlineExec(query) {
    return new Promise((resolve, reject) => {
        query.exec(function (err, records) {
            if (err)
                reject(err);
            resolve(records);
        });
    });
}
