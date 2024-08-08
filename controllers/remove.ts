import { AdminUtil } from "../lib/adminUtil";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

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
    let record;
    try {
        record = await entity.model.findOne(req.param('id'));
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
        destroyedRecord = await entity.model.destroyOne(record[entity.config.identifierField || sails.config.adminpanel.identifierField]);
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
