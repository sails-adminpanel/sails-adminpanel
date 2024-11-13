import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import { AccessRightsHelper } from "../helper/accessRightsHelper";
import { NodeTable } from "../lib/datatable/NodeTable";
import {DataAccessor} from "../lib/v4/DataAccessor";

export default async function listJson(req: ReqType, res: ResType): Promise<void> {
    try {

        let entity = AdminUtil.findEntityObject(req);
        if (!entity.model) {
            return res.notFound();
        }

        if (sails.config.adminpanel.auth) {
            if (!req.session.UserAP) {
                res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
                return
            } else if (!AccessRightsHelper.havePermission(`read-${entity.name}-model`, req.session.UserAP)) {
                res.sendStatus(403);
                return
            }
        }

        let dataAccessor = new DataAccessor(req.session.UserAP, entity, "list");
        let fields = dataAccessor.getFieldsConfig();
        const nodeTable = new NodeTable(req.body, entity.model, fields);

        //@ts-ignore
        await nodeTable.output((err: Error, data: []): void => {
            if (err) {
                sails.log.error(err);
                return
            }

            // Directly send this data as output to Datatable
            res.send(data)
            return
        }, dataAccessor)
    } catch (error) {
        sails.log.error(error)
    }
};
