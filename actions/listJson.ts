import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import { ConfigHelper } from "../helper/configHelper";

export default async function listJson(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    if (!sails.adminpanel.havePermission(req, instance.config, __filename)) {
        return res.redirect("/admin/userap/login");
    }

    if (sails.config.adminpanel.auth) {
        req.locals.user = req.session.UserAP;
    }

    let records: any = [];
    let fields = FieldsHelper.getFields(req, instance, 'list');

    let query;
    try {
        query = await instance.model.find();
    } catch (e) {
        sails.log.error(e);
    }

    FieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
        query.populate(val);
    });

    records = await waterlineExec(query);

    let identifierField = ConfigHelper.getIdentifierField(instance.config.model);
    let keyFields = Object.keys(fields);
    let result = [];

    records.forEach((instance) => {
        let a = [];
        a.push(instance[identifierField]); // Push ID for Actions
        keyFields.forEach((key) => {
            let fieldData = "";
            let displayField = fields[key].config.displayField;
            if(fields[key].model.model){
                if (!instance[key]){
                    fieldData = ""
                } else {
                    // Model
                    fieldData = instance[key][displayField];
                }
            } else if (fields[key].model.collection) {
                if (!instance[key] || !instance[key].length) {
                    fieldData = ""
                }
                else {
                    // Collection
                    instance[key].forEach((item)=>{
                        if (fieldData !== "") fieldData += ", "
                        fieldData += !item[displayField] ? item[fields[key].config.identifierField] : item[displayField];
                    })
                }

            } else {
                // Plain data
                fieldData = instance[key];
            }

            if (typeof fields[key].config.displayModifier === "function") {
                a.push(fields[key].config.displayModifier(fieldData));
            } else {
                a.push(fieldData);
            }
        });
        result.push(a);
    });

    res.json({
        data: result
    });
};


async function waterlineExec(query) {
    return new Promise((resolve, reject) => {
        query.exec(function(err, records) {
            if (err) reject(err);
            resolve(records)
        });
      });
}
