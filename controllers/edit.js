"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
const adminUtil_1 = require("../lib/adminUtil");
const requestProcessor_1 = require("../lib/requestProcessor");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const CatalogHandler_1 = require("../lib/catalog/CatalogHandler");
const MediaManagerHelper_1 = require("../lib/media-manager/helpers/MediaManagerHelper");
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
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let record;
    try {
        const id = req.param('id');
        record = await entity.model.findOne(id).populateAll();
    }
    catch (e) {
        sails.log.error('Admin edit error: ');
        sails.log.error(e);
        return res.serverError();
    }
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, entity, 'edit');
    let reloadNeeded = false;
    fields = await fieldsHelper_1.FieldsHelper.loadAssociations(fields);
    // Save
    if (req.method.toUpperCase() === 'POST') {
        let reqData = requestProcessor_1.RequestProcessor.processRequest(req, fields);
        let params = {};
        params[entity.config.identifierField || sails.config.adminpanel.identifierField] = req.param('id');
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
            if (fields[prop].config.type === 'select-many') {
                reqData[prop] = reqData[prop].toString().split(",");
            }
            // delete property from association-many and association if empty
            if (fields[prop] && fields[prop].model && (fields[prop].model.type === 'association-many' || fields[prop].model.type === 'association')) {
                if (!reqData[prop]) {
                    delete reqData[prop];
                }
            }
            if (fields[prop].config.type === 'mediamanager' && fields[prop].model.type === 'association-many') {
                if (typeof reqData[prop] === "object" && !Array.isArray(reqData[prop]) && reqData[prop] !== null) {
                    reqData[prop] = (reqData[prop]).list.map((i) => i.id);
                }
                else {
                    try {
                        const parsed = JSON.parse(reqData[prop]);
                        if (typeof parsed === "object" && !Array.isArray(parsed) && parsed !== null) {
                            reqData[prop] = parsed.list.map((i) => i.id);
                        }
                    }
                    catch (error) {
                        throw `Error assign association-many mediamanager data for ${prop}, ${reqData[prop]}`;
                    }
                }
                reqData[prop] = reqData[prop].filter(str => str !== '');
                if (Array.isArray(reqData[prop]) && reqData[prop].length === 0) {
                    delete (reqData[prop]);
                }
            }
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
                if (typeof reqData[prop] === "string") {
                    try {
                        reqData[prop] = JSON.parse(reqData[prop]);
                    }
                    catch (e) {
                        // Why it here @roman?
                        if (typeof reqData[prop] === "string" && reqData[prop].toString().replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                            sails.log.error(JSON.stringify(reqData[prop]), e);
                        }
                    }
                }
            }
            // split string for association-many
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'association-many' && reqData[prop]) {
                reqData[prop] = reqData[prop].toString().split(",");
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
            let newRecord = await entity.model.update(params, reqData).fetch();
            // save associations media to json
            await (0, MediaManagerHelper_1.updateRelationsMediaManager)(fields, reqData, entity.name, newRecord[0].id);
            sails.log.debug(`Record was updated: `, newRecord);
            if (req.body.jsonPopupCatalog) {
                return res.json({ record: newRecord });
            }
            else {
                // update navigation tree after model updated
                if (sails.config.adminpanel.navigation) {
                    for (const section of sails.config.adminpanel.navigation.sections) {
                        let navigation = CatalogHandler_1.CatalogHandler.getCatalog('navigation');
                        navigation.setID(section);
                        let navItem = navigation.itemTypes.find(item => item.type === entity.name);
                        if (navItem) {
                            await navItem.updateModelItems(newRecord[0].id, { record: newRecord[0] }, section);
                        }
                    }
                }
                req.session.messages.adminSuccess.push('Your record was updated !');
                return res.redirect(`${sails.config.adminpanel.routePrefix}/model/${entity.name}`);
            }
        }
        catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
            return e;
        }
    }
    for (const field of Object.keys(fields)) {
        if (fields[field].config.type === 'mediamanager') {
            if (fields[field].model.type === 'association-many') {
                record[field] = await (0, MediaManagerHelper_1.getRelationsMediaManager)({
                    list: record[field],
                    mediaManagerId: fields[field].config.options.mediaManagerId ?? "default"
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
