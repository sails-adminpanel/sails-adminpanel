import { AdminUtil } from "../lib/adminUtil";
import { AccessRightsHelper } from "../helper/accessRightsHelper";

export default function upload(req: ReqType, res: ResType) {

	//console.log('admin > CK-upload');
	let entity = AdminUtil.findEntityObject(req);

	if (sails.config.adminpanel.auth) {
		if (!req.session.UserAP) {
			return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
		} else if (!AccessRightsHelper.enoughPermissions([
			`update-${entity.name}-model`,
			`create-${entity.name}-model`,
			`update-${entity.name}-form`,
			`create-${entity.name}-form`
		], req.session.UserAP)) {
			return res.sendStatus(403);
		}
	}

	if (req.method.toUpperCase() === 'POST') {
		// set upload directory
		const dirDownload = `uploads/${entity.type}/${entity.name}/ckeditor`;
		const dir = `${process.cwd()}/.tmp/public/${dirDownload}/`;

		// make random string in end of file
		let rand = '';
		const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 10; i++) {
			rand += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		//save file
		const filenameOrig = req.body.name.replace(' ', '_');
		let filename = filenameOrig.replace(/$/, '_prefix');

		req.file('image').upload({
			dirname: dir,
			saveAs: filename
		}, function (err, file) {
			if (err) return res.serverError(err);

			return res.send({
				msg: "success",
				url: `/${dirDownload}/${filename}`
			})
		})
	}
}
