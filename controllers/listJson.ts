import { AdminUtil } from "../lib/adminUtil";
import { FieldsHelper } from "../helper/fieldsHelper";
import { ConfigHelper } from "../helper/configHelper";

export default async function listJson(req, res) {
    let instance = AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }

    let records: any = [];
    let fields = FieldsHelper.getFields(req, instance, 'list');

    let query;
    try {
        // adminpanel design do not support list of more than 20000 lines per request
        // !TODO take off this limit
        query = await instance.model.find().limit(20000);
    } catch (e) {
        sails.log.error(e);
    }

    FieldsHelper.getFieldsToPopulate(fields).forEach(function(val) {
        query.populate(val);
    });

    records = query;

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
