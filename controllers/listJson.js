"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listJson;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const NodeTable_1 = require("../lib/datatable/NodeTable");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
async function listJson(req, res) {
    try {
        let entity = adminUtil_1.AdminUtil.findEntityObject(req);
        if (!entity.model) {
            return res.notFound();
        }
        if (sails.config.adminpanel.auth) {
            if (!req.session.UserAP) {
                res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
                return;
            }
            else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
                res.sendStatus(403);
                return;
            }
        }
        let dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "list");
        let fields = dataAccessor.getFieldsConfig();
        const nodeTable = new NodeTable_1.NodeTable(req.body, entity.model, fields);
        //@ts-ignore
        await nodeTable.output((err, data) => {
            if (err) {
                sails.log.error(err);
                return;
            }
            // Directly send this data as output to Datatable
            res.send(data);
            return;
        }, dataAccessor);
    }
    catch (error) {
        sails.log.error(error);
    }
}
;
