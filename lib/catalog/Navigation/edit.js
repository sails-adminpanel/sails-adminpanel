"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../../adminUtil");
async function edit(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    let record = await entity.model.findOne(req.param('id')).populateAll();
    return res.redirect(`/admin/catalog/navigation/${record.label}`);
}
exports.default = edit;
