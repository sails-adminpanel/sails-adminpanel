"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const configHelper_1 = require("../helper/configHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const NodeTable_1 = require("../lib/datatable/NodeTable");
async function listJson(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (!entity.model) {
        return res.notFound();
    }
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let records = [];
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, entity, 'list');
    let query;
    try {
        // adminpanel design do not support list of more than 5000 lines per request
        // !TODO take off this limit :)
        query = entity.model.find({}).limit(5000);
    }
    catch (e) {
        sails.log.error(e);
    }
    fieldsHelper_1.FieldsHelper.getFieldsToPopulate(fields).forEach(function (val) {
        query.populate(val);
    });
    const nodeTable = new NodeTable_1.NodeTable(req.query, entity.model, fields);
    nodeTable.output((err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        // Directly send this data as output to Datatable
        res.send(data);
    });
    return;
    records = await waterlineExec(query);
    let identifierField = configHelper_1.ConfigHelper.getIdentifierField(entity.config.model);
    let keyFields = Object.keys(fields);
    let result = [];
    records.reverse().forEach((entity) => {
        let a = [];
        a.push(entity[identifierField]); // Push ID for Actions
        keyFields.forEach((key) => {
            let fieldData = "";
            let displayField = fields[key].config.displayField;
            if (fields[key].model.model) {
                if (!entity[key]) {
                    fieldData = "";
                }
                else {
                    // Model
                    fieldData = entity[key][displayField];
                }
            }
            else if (fields[key].model.collection) {
                if (!entity[key] || !entity[key].length) {
                    fieldData = "";
                }
                else {
                    // Collection
                    entity[key].forEach((item) => {
                        if (fieldData !== "")
                            fieldData += ", ";
                        fieldData += !item[displayField] ? item[fields[key].config.identifierField] : item[displayField];
                    });
                }
            }
            else {
                // Plain data
                fieldData = entity[key];
            }
            if (typeof fields[key].config.displayModifier === "function") {
                a.push(fields[key].config.displayModifier(entity[key]));
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
