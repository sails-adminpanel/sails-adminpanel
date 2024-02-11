"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
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
        return res.send(data);
    });
}
exports.default = listJson;
;
