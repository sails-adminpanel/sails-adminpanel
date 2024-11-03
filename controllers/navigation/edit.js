"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = edit;
const adminUtil_1 = require("../../lib/adminUtil");
async function edit(req, res) {
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    let record = await entity.model.findOne(req.param('id')).populateAll();
    return res.redirect(`/admin/catalog/navigation/${record.label}`);
}
