"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
const adminUtil_1 = require("../lib/adminUtil");
const requestProcessor_1 = require("../lib/requestProcessor");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const CatalogHandler_1 = require("../lib/catalog/CatalogHandler");
const MediaManagerHelper_1 = require("../lib/media-manager/helpers/MediaManagerHelper");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
async function edit(req, res) {
    //Check id
    if (!req.param('id')) {
        return res.notFound();
    }
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (!entity.model) {
        return res.notFound();
    }
    if (!entity.config.edit) {
        return res.redirect(entity.uri);
    }
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let record;
    let dataAccessor;
    try {
        const id = req.param('id');
        dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "edit");
        record = await entity.model._findOne({ id: id }, dataAccessor);
    }
    catch (e) {
        adminizer.log.error('Admin edit error: ');
        adminizer.log.error(e);
        return res.serverError();
    }
    let fields = dataAccessor.getFieldsConfig();
    // add deprecated 'records' to config
    fields = await fieldsHelper_1.FieldsHelper.loadAssociations(fields, req.session.UserAP, "edit");
    // Save
    if (req.method.toUpperCase() === 'POST') {
        let reqData = requestProcessor_1.RequestProcessor.processRequest(req, fields);
        let params = {};
        params[entity.config.identifierField || adminizer.config.identifierField] = req.param('id');
        /**
         * Here means reqData adapt for model data, but rawReqData is processed for widget processing
         */
        const rawReqData = { ...reqData };
        for (let prop in reqData) {
            if (fields[prop].model.type === 'boolean') {
                reqData[prop] = Boolean(reqData[prop]);
            }
            if (Number.isNaN(reqData[prop]) || reqData[prop] === undefined || reqData[prop] === null) {
                delete reqData[prop];
            }
            if (reqData[prop] === "" && fields[prop].model.allowNull === true) {
                reqData[prop] = null;
            }
            let fieldConfigConfig = fields[prop].config;
            if (fieldConfigConfig.type === 'select-many') {
                reqData[prop] = reqData[prop].toString().split(",");
            }
            // delete property from association-many and association if empty
            if (fields[prop] && fields[prop].model && (fields[prop].model.type === 'association-many' || fields[prop].model.type === 'association')) {
                if (!reqData[prop]) {
                    delete reqData[prop];
                }
            }
            if (fieldConfigConfig.type === 'mediamanager' && typeof reqData[prop] === "string") {
                try {
                    const parsed = JSON.parse(reqData[prop]);
                    rawReqData[prop] = parsed;
                }
                catch (error) {
                    throw `Error assign association-many mediamanager data for ${prop}, ${reqData[prop]}`;
                }
                delete reqData[prop];
            }
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
                if (typeof reqData[prop] === "string") {
                    try {
                        reqData[prop] = JSON.parse(reqData[prop]);
                    }
                    catch (e) {
                        // Why it here @roman?
                        if (typeof reqData[prop] === "string" && reqData[prop].toString().replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                            adminizer.log.error(JSON.stringify(reqData[prop]), e);
                        }
                    }
                }
            }
            // split string for association-many
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'association-many' && reqData[prop] && typeof reqData[prop] === "string") {
                reqData[prop] = reqData[prop].split(",");
            }
            // HardFix: Long string was splitted as array of strings. https://github.com/balderdashy/sails/issues/7262
            if (fields[prop].model.type === 'string' && Array.isArray(reqData[prop])) {
                reqData[prop] = reqData[prop].join("");
            }
        }
        // callback before save entity
        let entityEdit = entity.config.edit;
        if (typeof entityEdit.entityModifier === "function") {
            reqData = entityEdit.entityModifier(reqData);
        }
        try {
            let newRecord = await entity.model._update(params, reqData, dataAccessor);
            await (0, MediaManagerHelper_1.saveRelationsMediaManager)(fields, rawReqData, entity.model.identity, newRecord[0].id);
            adminizer.log.debug(`Record was updated: `, newRecord);
            if (req.body.jsonPopupCatalog) {
                return res.json({ record: newRecord });
            }
            else {
                // update navigation tree after model updated
                if (adminizer.config.navigation) {
                    for (const section of adminizer.config.navigation.sections) {
                        let navigation = CatalogHandler_1.CatalogHandler.getCatalog('navigation');
                        navigation.setId(section);
                        let navItem = navigation.itemTypes.find(item => item.type === entity.name);
                        if (navItem) {
                            await navItem.updateModelItems(newRecord[0].id, { record: newRecord[0] }, section);
                        }
                    }
                }
                req.session.messages.adminSuccess.push('Your record was updated !');
                return res.redirect(`${adminizer.config.routePrefix}/model/${entity.name}`);
            }
        }
        catch (e) {
            adminizer.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
            return e;
        }
    } // END POST
    for (const field of Object.keys(fields)) {
        let fieldConfigConfig = fields[field].config;
        if (fieldConfigConfig.type === 'mediamanager') {
            if (fields[field].model.type === 'association-many') {
                console.log(fieldConfigConfig.options);
                record[field] = await (0, MediaManagerHelper_1.getRelationsMediaManager)({
                    list: record[field],
                    mediaManagerId: fieldConfigConfig.options.id ?? "default"
                });
            }
            else if (fields[field].model.type === "json") {
                record[field] = await (0, MediaManagerHelper_1.getRelationsMediaManager)(record[field]);
            }
        }
    }
    if (req.query.without_layout) {
        return res.viewAdmin("./../ejs/partials/content/editPopup.ejs", {
            entity: entity,
            record: record,
            fields: fields
        });
    }
    else {
        return res.viewAdmin({
            entity: entity,
            record: record,
            fields: fields
        });
    }
}
;
