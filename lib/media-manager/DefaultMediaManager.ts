import {AbstractMediaManager} from "./AbstractMediaManager";
import {randomFileName} from "./helpers/MediaManagerHelper";
import * as sharp from "sharp";
import sails from "sails-typescript";

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

interface Meta {
	title: string
	author: string
	description: string
}

export class DefaultMediaManager extends AbstractMediaManager {
	public id: string = 'default'
	public path: string = 'media-manager'
	public dir: string = `${process.cwd()}/.tmp/public/${this.path}/`

	public async getLibrary(req: ReqType, res: ResType): Promise<sails.Response> {
		let data = await MediaManagerAP.find({
			where: {parent: null},
			limit: req.param('count'),
			skip: req.param('skip'),
			sort: 'createdAt DESC'
		}).populate('children')

		let next = (await MediaManagerAP.find({
			where: {parent: null},
			limit: +req.param('count'),
			skip: +req.param('skip') === 0 ? +req.param('count') : +req.param('skip') + +req.param('count'),
			sort: 'createdAt DESC'
		})).length
		return res.send({
			data: data,
			next: !!next
		})
	}

	public async upload(req: ReqType, res: ResType): Promise<sails.Response | void> {

		let filename = randomFileName(req.body.name.replace(' ', '_'))

		//save file
		req.file('file').upload({
			dirname: this.dir,
			saveAs: filename
		}, async (err, file): Promise<sails.Response | void> => {
			if (err) return res.serverError(err);

			return res.send({
				msg: "success",
				data: await this.setData(file[0], `/${this.path}/${filename}`, filename)
			})
		})
	}

	protected async setData(file: UploaderFile, url: string, filename: string) {
		//create empty meta
		let metaData: Meta ={
			author: "",
			description: "",
			title: ""
		}
		let meta = await MediaManagerMetaAP.create(metaData).fetch()

		//create parent file
		let parent = await MediaManagerAP.create({
			parent: null,
			mimeType: file.type,
			size: file.size,
			thumb: false,
			meta: meta.id,
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
			url: `/${this.path}/${thumbName}`
		}).fetch()

		return MediaManagerAP.find({
			where: {id: parent.id}
		}).populate('children');

	}

	protected async resizeImage(input: string, output: string, width: number, height: number) {
		return await sharp(input)
			.resize({width: width, height: height})
			.toFile(output)
	}

	public async setMeta(req: ReqType, res: ResType): Promise<sails.Response> {
		const data = req.body.data
		const id = req.body.metaId

		try {
			await MediaManagerMetaAP.update({id: id}, data)
			return res.send({
				msg: "success",
			})
		} catch (e) {
			console.log(e)
		}
	}

	public async getMeta(req: ReqType, res: ResType): Promise<sails.Response> {
		const data = req.body
		const fields: Meta = {
			author: "",
			description: "",
			title: ""
		}
		return res.send({
			data: (await MediaManagerMetaAP.find({where: {id: data.metaId}}))[0],
			fields: fields
		})
	}

}
