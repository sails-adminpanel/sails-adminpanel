import {AdminUtil} from "../../adminUtil";

export default async function edit(req, res) {
	let entity = AdminUtil.findEntityObject(req);
	let record:any = await entity.model.findOne(req.param('id')).populateAll();
	return res.redirect(`/admin/catalog/navigation/${record.label}`)
}
