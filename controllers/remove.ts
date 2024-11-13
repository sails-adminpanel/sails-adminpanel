import { AdminUtil } from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {deleteRelationsMediaManager} from "../lib/media-manager/helpers/MediaManagerHelper";
import { ModelAnyField, ModelAnyInstance } from "../lib/v4/model/AbstractModel";
import {DataAccessor} from "../lib/v4/DataAccessor";

export default async function remove(req: ReqType, res: ResType) {
    //Checking id of the record
    if (!req.param('id')) {
        sails.log.error(new Error('Admin panel: No id for record provided'));
        return res.notFound();
    }

    let entity = AdminUtil.findEntityObject(req);
    if (!entity.model) {
        sails.log.error(new Error('Admin panel: no model found'));
        return res.notFound();
    }

    if (!entity.config.remove) {
        return res.redirect(entity.uri);
    }

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`delete-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    /**
     * Searching for record by model
     */
    let record: ModelAnyInstance;
    let dataAccessor;
    try {
        dataAccessor = new DataAccessor(req.session.UserAP, entity, "remove");
        record = await entity.model._findOne(req.param('id'), dataAccessor) as ModelAnyInstance;
    } catch (e) {
        if (req.wantsJSON) {
            return res.json({
                success: false,
                message: e.message
            });
        }
        return res.serverError(e);
    }

    if (!record) {
        let msg = 'Admin panel: No record found with id: ' + req.param('id');
        if (req.wantsJSON) {
            return res.json({
                success: false,
                message: msg
            });
        }
        return res.notFound();
    }
    // sails.log.debug('admin > remove > record > ', record);

    let destroyedRecord;
    try {
        const fieldId = entity.config.identifierField ?? sails.config.adminpanel.identifierField;
		const q: Record<string, ModelAnyField> = {

        }
        q[fieldId] = record[fieldId]
        destroyedRecord = await entity.model._destroy(q, dataAccessor)

		// delete relations media manager
		await deleteRelationsMediaManager(entity.name, destroyedRecord)
    } catch (e) {
        sails.log.error('adminpanel > error', e);
    }

    if (destroyedRecord) {
        req.session.messages.adminSuccess.push('Record was removed successfully');
    } else {
        req.session.messages.adminError.push('Record was not removed');
    }

    res.redirect(entity.uri);
};
