import { AdminUtil } from "../lib/adminUtil";
import { RequestProcessor } from "../lib/requestProcessor";
import { FieldsHelper } from "../helper/fieldsHelper";
import {CreateUpdateConfig} from "../interfaces/adminpanelConfig";

export default async function add(req, res) {
    let instance = AdminUtil.findInstanceObject(req);

    if (!instance.model) {
        return res.notFound();
    }

    if (!instance.config.add) {
        return res.redirect(instance.uri);
    }

    let fields = await FieldsHelper.getFields(req, instance, 'add');
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
        }

        // callback before save instance
        let instanceAdd = instance.config.add as CreateUpdateConfig;
        if (typeof instanceAdd.instanceModifier === "function") {
            reqData = instanceAdd.instanceModifier(reqData);
        }

        try {
            let record = await instance.model.create(reqData).fetch();
            sails.log(`A new record was created: `, record);
            req.flash('adminSuccess', 'Your record was created !');
        } catch (e) {
            sails.log.error(e);
            req.flash('adminError', e.message || 'Something went wrong...');
            data = reqData;
        }
    }

    return res.viewAdmin({
        instance: instance,
        fields: fields,
        data: data
    });
};
