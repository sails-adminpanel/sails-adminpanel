import {AbstractMediaManager} from "./AbstractMediaManager";

interface UploaderFile {
	fd: string
	size: number
	type: string
	filename: string
	status: string
	field: string
	extra: string | undefined
}

export class DefaultMediaManager extends AbstractMediaManager {
	public id: string = 'default'

	upload(req: ReqType, res: ResType) {
		const dir = `${process.cwd()}/.tmp/public/media-manager/`;

		// make random string in end of file
		const prefixLength = 8;
		const randomPrefix = Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36)

		//save file
		const filenameOrig = req.body.name.replace(' ', '_');
		let filename = filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}$&`)

		req.file('file').upload({
			dirname: dir,
			saveAs: filename
		}, async (err, file) => {
			if (err) return res.serverError(err);

			await this.setData(file)

			// return res.send({
			// 	msg: "success",
			// 	url: `/media-manager/${filename}`
			// })
		})
	}

	protected async setData(file: UploaderFile[]) {
		console.log(file)
	}

}
