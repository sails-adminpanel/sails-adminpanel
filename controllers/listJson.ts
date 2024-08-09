import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import { ConfigHelper } from "../helper/configHelper";
import { AccessRightsHelper } from "../helper/accessRightsHelper";
import { NodeTable } from "../lib/datatable/NodeTable";

export default async function listJson(req: ReqType, res: ResType) {
    try {

        let entity = AdminUtil.findEntityObject(req);
        if (!entity.model) {
            return res.notFound();
        }

        if (sails.config.adminpanel.auth) {
            if (!req.session.UserAP) {
                return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
            } else if (!AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
                return res.sendStatus(403);
            }
        }

        let fields = FieldsHelper.getFields(req, entity, 'list');
        const nodeTable = new NodeTable(req.body, entity.model, fields);

        //@ts-ignore
        nodeTable.output((err: Error, data: []) => {
            if (err) {
                sails.log.error(err);
                return;
            }

            // Directly send this data as output to Datatable
            return res.send(data)
        })
    } catch (error) {
        sails.log.error(error)
    }
};