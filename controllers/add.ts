import { AdminUtil } from "../lib/adminUtil";
import { RequestProcessor } from "../lib/requestProcessor";
import { FieldsHelper } from "../helper/fieldsHelper";
import {CreateUpdateConfig} from "../interfaces/adminpanelConfig";
import {AccessRightsHelper} from "../helper/accessRightsHelper";

export default async function add(req, res) {
    let entity = AdminUtil.findEntityObject(req);

    if (!entity.model) {
        return res.notFound();
    }

    if (!entity.config.add) {
        return res.redirect(entity.uri);
    }

    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`create-${entity.name}-entity`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }

    let fields = FieldsHelper.getFields(req, entity, 'add');
    let data = {}; //list of field values

    fields = await FieldsHelper.loadAssociations(fields);

    if (req.method.toUpperCase() === 'POST') {
        let reqData = RequestProcessor.processRequest(req, fields);

        for (let prop in reqData) {
            if (Number.isNaN(reqData[prop]) || reqData[prop] === undefined || reqData[prop] === null) {
                delete reqData[prop]
            }

            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
                try {
                    reqData[prop] = JSON.parse(reqData[prop]);
                } catch(e){
                    if (typeof reqData[prop] === "string" && reqData[prop].replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
                        sails.log.error(e);
                    }
                }
            }

            // delete whitespace characters from association-many and association
            if (fields[prop] && fields[prop].model && (fields[prop].model.type === 'association-many' || fields[prop].model.type === 'association')) {
                if (!reqData[prop]) {
                    reqData[prop] = "null";
                }
            }

            // split string for association-many
            if (fields[prop] && fields[prop].model && fields[prop].model.type === 'association-many' && reqData[prop]) {
                reqData[prop] = reqData[prop].split(",")
            }
        }

        // callback before save entity
        let entityAdd = entity.config.add as CreateUpdateConfig;
        if (typeof entityAdd.entityModifier === "function") {
            reqData = entityAdd.entityModifier(reqData);
        }

        try {
            let record = await entity.model.create(reqData).fetch();
            sails.log(`A new record was created: `, record);
            req.session.messages.adminSuccess.push('Your record was created !');
        } catch (e) {
            sails.log.error(e);
            req.session.messages.adminError.push(e.message || 'Something went wrong...');
            data = reqData;
        }
    }

    return res.viewAdmin({
        entity: entity,
        fields: fields,
        data: data
    });
};
