import {AdminUtil} from "../../lib/adminUtil";

export default async function edit(req: ReqType, res: ResType) {
	let entity = AdminUtil.findEntityObject(req);
	let record:any = await entity.model.findOne(req.param('id')).populateAll();
	return res.redirect(`/admin/catalog/navigation/${record.label}`)
}
