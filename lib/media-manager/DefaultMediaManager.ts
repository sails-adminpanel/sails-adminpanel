import {AbstractMediaManager} from "./AbstractMediaManager";
import {randomFileName} from "./helpers/MediaManagerHelper";
import * as sharp from "sharp";
import MediaManagerAP from "../../models/MediaManagerAP";

const sizeOf = require("image-size")

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
	public path: string = 'media-manager'
	public dir: string = `${process.cwd()}/.tmp/public/${this.path}/`

	public async getLibrary(req: ReqType, res: ResType){
		let data = await MediaManagerAP.find({
			where: {thumb: true},
			limit: req.param('count'),
			skip: req.param('skip'),
			sort: 'createdAt DESC'
		}).populate('parent')

		let next = (await MediaManagerAP.find({
			where: {thumb: true},
			limit: +req.param('count'),
			skip: +req.param('skip') === 0 ? +req.param('count') : +req.param('skip') + +req.param('count'),
			sort: 'createdAt DESC'
		})).length
		res.send({
			data: data,
			next: !!next
		})
	}

	public async upload(req: ReqType, res: ResType) {

		let filename = randomFileName(req.body.name.replace(' ', '_'))

		//save file
		req.file('file').upload({
			dirname: this.dir,
			saveAs: filename
		}, async (err, file) => {
			if (err) return res.serverError(err);

			return res.send({
				msg: "success",
				data: await this.setData(file[0], `/${this.path}/${filename}`, filename)
			})
		})
	}

	protected async setData(file: UploaderFile, url: string, filename: string) {

		let parent = await MediaManagerAP.create({
			parent: null,
			mimeType: file.type,
			size: file.size,
			thumb: false,
			image_size: sizeOf(file.fd),
			url: url
		}).fetch();

		//create thumb
		const thumbName = randomFileName(filename, '_thumb')
		const thumb = await this.resizeImage(file.fd, `${this.dir}${thumbName}`, 150, 150)

		let thumbRecord = await MediaManagerAP.create({
			parent: parent.id,
			mimeType: file.type,
			size: thumb.size,
			thumb: true,
			image_size: sizeOf(`${this.dir}${thumbName}`),
			url:`/${this.path}/${thumbName}`
		}).fetch()

		return await MediaManagerAP.find({
			where: {id: thumbRecord.id}
		}).populate('parent')

	}

	protected async resizeImage(input: string, output: string, width: number, height: number) {
		return await sharp(input)
			.resize({width: width, height: height})
			.toFile(output)
	}

}

// {
// 	format: 'png',
// 	width: 150,
// 	height: 150,
// 	channels: 4,
// 	premultiplied: true,
// 	size: 41877
// }
