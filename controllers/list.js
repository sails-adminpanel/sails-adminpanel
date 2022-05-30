"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const fieldsHelper_1 = require("../helper/fieldsHelper");
async function list(req, res) {
    let instance = adminUtil_1.AdminUtil.findInstanceObject(req);
    if (!instance.model) {
        return res.notFound();
    }
    // add here check permission
    // what permission? read all instances?
    let fields = fieldsHelper_1.FieldsHelper.getFields(req, instance, 'list');
    res.viewAdmin({
        instance: instance,
        fields: fields,
        config: sails.adminpanel
    });
}
exports.default = list;
;
