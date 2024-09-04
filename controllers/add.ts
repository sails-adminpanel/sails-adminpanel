import {AdminUtil} from "../lib/adminUtil";
import {RequestProcessor} from "../lib/requestProcessor";
import {FieldsHelper} from "../helper/fieldsHelper";
import {CreateUpdateConfig} from "../interfaces/adminpanelConfig";
import {AccessRightsHelper} from "../helper/accessRightsHelper";
import {saveRelationsMediaManager} from "../lib/media-manager/helpers/MediaManagerHelper";

export default async function add(req: ReqType, res: ResType) {
	let entity = AdminUtil.findEntityObject(req);

	if (!entity.model) {
		return res.notFound();
	}

	if (!entity.config?.add) {
		return res.redirect(entity.uri);
	}

	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	let fields = FieldsHelper.getFields(req, entity, 'add');
	let data = {}; //list of field values

	fields = await FieldsHelper.loadAssociations(fields);

	if (req.method.toUpperCase() === 'POST') {
		let reqData: any = RequestProcessor.processRequest(req, fields);
		for (let prop in reqData) {

			if (Number.isNaN(reqData[prop]) || reqData[prop] === undefined || reqData[prop] === null) {
				delete reqData[prop]
			}

			if (reqData[prop] === "" && fields[prop].model.allowNull === true) {
				reqData[prop] = null
			}

			if (fields[prop].config.type === 'select-many') {
				reqData[prop] = reqData[prop].split(",")
			}

			if (fields[prop] && fields[prop].model && fields[prop].model.type === 'json' && reqData[prop] !== '') {
				try {
					reqData[prop] = JSON.parse(reqData[prop]);
				} catch (e) {
					if (typeof reqData[prop] === "string" && reqData[prop].replace(/(\r\n|\n|\r|\s{2,})/gm, "")) {
						sails.log.error(e);
					}
				}
			}

			// delete property from association-many and association if empty
			if (fields[prop] && fields[prop].model && (fields[prop].model.type === 'association-many' || fields[prop].model.type === 'association')) {
				if (!reqData[prop]) {
					delete reqData[prop];
				}
			}

			// split string for association-many
			if (fields[prop] && fields[prop].model && fields[prop].model.type === 'association-many' && reqData[prop]) {
				reqData[prop] = reqData[prop].split(",")
			}

			// HardFix: Long string was splitted as array of strings. https://github.com/balderdashy/sails/issues/7262
			if (fields[prop].model.type === 'string' && Array.isArray(reqData[prop])) {
				reqData[prop] = reqData[prop].join("");
			}
		}

		// callback before save entity
		let entityAdd = entity.config.add as CreateUpdateConfig;
		if (typeof entityAdd.entityModifier === "function") {
			reqData = entityAdd.entityModifier(reqData);
		}

		try {
			let record = await entity.model.create(reqData).fetch();

			// save associations media to json
			await saveRelationsMediaManager(fields, reqData, entity.name, record.id)

			sails.log.debug(`A new record was created: `, record);
			if (req.body.jsonPopupCatalog) {
				return res.json({record: record})
			} else {
				req.session.messages.adminSuccess.push('Your record was created !');
				return res.redirect(`${sails.config.adminpanel.routePrefix}/model/${entity.name}`);
			}
		} catch (e) {
			sails.log.error(e);
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
	} else {
		return res.viewAdmin({
			entity: entity,
			fields: fields,
			data: data
		});
	}
};
