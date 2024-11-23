"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = add;
const adminUtil_1 = require("../lib/adminUtil");
const requestProcessor_1 = require("../lib/requestProcessor");
const fieldsHelper_1 = require("../helper/fieldsHelper");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const MediaManagerHelper_1 = require("../lib/media-manager/helpers/MediaManagerHelper");
const DataAccessor_1 = require("../lib/v4/DataAccessor");
async function add(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (!entity.model) {
        return res.notFound();
    }
    if (!entity.config?.add) {
        return res.redirect(entity.uri);
    }
    if (adminizer.config.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${adminizer.config.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    let dataAccessor = new DataAccessor_1.DataAccessor(req.session.UserAP, entity, "add");
    let fields = dataAccessor.getFieldsConfig();
    // add deprecated 'records' to config
    fields = await fieldsHelper_1.FieldsHelper.loadAssociations(fields, req.session.UserAP, "add");
    let data = {}; //list of field values
    if (req.method.toUpperCase() === 'POST') {
        let reqData = requestProcessor_1.RequestProcessor.processRequest(req, fields);
        /**
         * Here means reqData adapt for model data, but rawReqData is processed for widget processing
         */
        const rawReqData = { ...reqData };
        for (let prop in reqData) {
            if (Number.isNaN(reqData[prop]) || reqData[prop] === undefined || reqData[prop] === null) {
                delete reqData[prop];
            }
            if (reqData[prop] === "" && fields[prop].model.allowNull === true) {
                reqData[prop] = null;
            }
            let fieldConfigConfig = fields[prop].config;
            if (fieldConfigConfig.type === 'select-many') {
                reqData[prop] = reqData[prop].split(",");
            }
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
                try {
                    reqData[prop] = JSON.parse(reqData[prop]);
                }
                catch (e) {
                    if (typeof reqData[prop] === "string" && reqData[prop].replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                        adminizer.log.error(e);
                    }
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
            // delete property from association-many and association if empty
            if (fields[prop] && fields[prop].model && (fields[prop].model.type === 'association-many' || fields[prop].model.type === 'association')) {
                if (!reqData[prop]) {
                    delete reqData[prop];
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
        let entityAdd = entity.config.add;
        if (typeof entityAdd.entityModifier === "function") {
            reqData = entityAdd.entityModifier(reqData);
        }
        try {
            let record = await entity.model._create(reqData, dataAccessor);
            // save associations media to json
            await (0, MediaManagerHelper_1.saveRelationsMediaManager)(fields, rawReqData, entity.model.identity, record.id);
            adminizer.log.debug(`A new record was created: `, record);
            if (req.body.jsonPopupCatalog) {
                return res.json({ record: record });
            }
            else {
                req.session.messages.adminSuccess.push('Your record was created !');
                return res.redirect(`${adminizer.config.routePrefix}/model/${entity.name}`);
            }
        }
        catch (e) {
            adminizer.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
            data = reqData;
        }
    }
    if (req.query?.without_layout) {
        return res.viewAdmin("./../ejs/partials/content/addPopup.ejs", {
            entity: entity,
            fields: fields,
            data: data
        });
    }
    else {
        return res.viewAdmin({
            entity: entity,
            fields: fields,
            data: data
        });
    }
}
;
