"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = remove;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const MediaManagerHelper_1 = require("../lib/media-manager/helpers/MediaManagerHelper");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
async function remove(req, res) {
    //Checking id of the record
    if (!req.param('id')) {
        sails.log.error(new Error('Admin panel: No id for record provided'));
        return res.notFound();
    }
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (!entity.model) {
        sails.log.error(new Error('Admin panel: no model found'));
        return res.notFound();
    }
    if (!entity.config.remove) {
        return res.redirect(entity.uri);
    }
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`delete-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    /**
     * Searching for record by model
     */
    let record;
    let dataAccessor;
    try {
        dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "remove");
        record = await entity.model._findOne(req.param('id'), dataAccessor);
    }
    catch (e) {
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
        const fieldId = entity.config.identifierField ?? adminizer.config.identifierField;
        const q = {};
        q[fieldId] = record[fieldId];
        destroyedRecord = await entity.model._destroy(q, dataAccessor);
        // delete relations media manager
        await (0, MediaManagerHelper_1.deleteRelationsMediaManager)(entity.name, destroyedRecord);
    }
    catch (e) {
        sails.log.error('adminpanel > error', e);
    }
    if (destroyedRecord) {
        req.session.messages.adminSuccess.push('Record was removed successfully');
    }
    else {
        req.session.messages.adminError.push('Record was not removed');
    }
    res.redirect(entity.uri);
}
;
