import {AbstractMediaManager, UploaderFile, Item, File} from "./AbstractMediaManager";
import {randomFileName, isImage} from "./helpers/MediaManagerHelper";
import * as sharp from "sharp";
import {ImageItem} from "./Items/ImageItem";

const fs = require('fs')

const sizeOf = require("image-size")



interface config {
	convert: string
	sizes: {
		[key: string]: {
			width: number,
			height: number
		}
	}[]
}

interface fileData {
	name: string
	width: number
	height: number
	id: string
}

export class DefaultMediaManager extends AbstractMediaManager {
	// public id: string = 'default'
	// public path: string = 'media-manager'
	// public dir: string = `${process.cwd()}/.tmp/public/${this.path}/`
	public readonly itemTypes: File<Item>[] = [];

	constructor(id: string, path: string, dir: string, model: string, metaModel: string) {
		super(id, path, dir, model);
		this.itemTypes.push(new ImageItem( path, dir, model, metaModel))
	}

	public async getLibrary(limit: number, skip: number, sort: string): Promise<{ data: Item[], next: boolean }> {
		let data: Item[] = await sails.models[this.model].find({
			where: {parent: null},
			limit: limit,
			skip: skip,
			sort: sort//@ts-ignore
		}).populate('children', {sort: sort})

		let next: number = (await sails.models[this.model].find({
			where: {parent: null},
			limit: limit,
			skip: skip === 0 ? limit : skip + limit,
			sort: sort
		})).length

		return {
			data: data,
			next: !!next
		}
	}

	protected async setData(file: UploaderFile, url: string, filename: string, config: config, origFileName: string) {
		if (isImage(file.type)) {
			return await this.setImage(file, url, filename, config, origFileName)
		} else {
			return await this.saveFile(file, url, filename, origFileName)
		}
	}

	public async getChildren(req: ReqType, res: ResType): Promise<sails.Response> {
		return res.send({
			data: (await MediaManagerAP.findOne({
				where: {id: req.body.id}
				//@ts-ignore
			}).populate('children', {sort: 'createdAt DESC'})).children
		})
	}

	// public async upload() {
		// const config: config = JSON.parse(req.body.config)
		//
		// let filename = randomFileName(req.body.name.replace(' ', '_'), '')
		// let origFileName = req.body.name.replace(/\.[^\.]+$/, '')
		//
		// //save file
		// req.file('file').upload({
		// 	dirname: this.dir,
		// 	saveAs: filename
		// }, async (err, file): Promise<sails.Response | void> => {
		// 	if (err) return res.serverError(err);
		// 	try {
		// 		return res.send({
		// 			msg: "success",
		// 			data: await this.setData(file[0], `/${this.path}/${filename}`, filename, config, origFileName)
		// 		})
		// 	} catch (e) {
		// 		console.error(e)
		// 	}
		// })
	// }

	public async uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void> {
		let fileData: fileData = JSON.parse(req.body.fileData)
		let filename = randomFileName(fileData.name, `_${fileData.width}x${fileData.height}`)
		let origFileName = fileData.name.replace(/\.[^\.]+$/, '')

		//save file
		req.file('file').upload({
			dirname: this.dir,
			saveAs: filename
		}, async (err, file): Promise<sails.Response | void> => {
			if (err) return res.serverError(err)
			try {
				let cropped = await MediaManagerAP.create({
					parent: fileData.id,
					mimeType: file[0].type,
					size: file[0].size,
					path: file[0].fd,
					cropType: `${fileData.width}x${fileData.height}`,
					filename: origFileName,
					image_size: sizeOf(file[0].fd),
					url: `/${this.path}/${filename}`
				}).fetch()
				if (cropped) {
					return res.send({msg: "success"})
				}
			} catch (e) {
				console.error(e)
			}
		})
	}


	private async saveFile(file: UploaderFile, url: string, filename: string, origFileName: string) {
		let meta = await this.createEmptyMeta()

		let parent = await MediaManagerAP.create({
			parent: null,
			mimeType: file.type,
			size: file.size,
			filename: origFileName,
			cropType: 'origin',
			meta: meta.id,
			image_size: null,
			url: url
		}).fetch();

		return MediaManagerAP.find({
			where: {id: parent.id}
		}).populate('children');
	}

	protected async setImage(file: UploaderFile, url: string, filename: string, config: config, origFileName: string) {
		const {
			parentDB,
			resFile,
			resFilename,
			resMIME
		} = await this.prepareOrigin(file, url, filename, config, origFileName)

		let parentSize = sizeOf(file.fd)
		if (parentSize.width > 150 && parentSize.height > 150) {
			await this.createSizes({
				id: parentDB.id,
				size: parentSize
			}, resFilename, resFile, resMIME, config, origFileName)
		}
		return MediaManagerAP.find({
			where: {id: parentDB.id}
		}).populate('children');
	}

	protected async prepareOrigin(file: UploaderFile, url: string, filename: string, config: config, origFileName: string) {
		let parent;
		let meta = await this.createEmptyMeta()
		let resFile = file.fd
		let resFilename = filename
		let resMIME = file.type

		// convert file, only webp & jpg
		if (this.checkConvert(config, file)) {
			let convertedFileName = filename.replace(/\.[^\.]+$/, `.${this.getConvertExtensions(config.convert)}`); //change file extension
			let convertFile = await this.convertImage(file.fd, `${this.dir}${convertedFileName}`)

			//create parent file converted
			parent = await MediaManagerAP.create({
				parent: null,
				mimeType: config.convert,
				size: convertFile.size,
				cropType: 'origin',
				path: `${this.dir}${convertedFileName}`,
				meta: meta.id,
				filename: origFileName,
				image_size: sizeOf(`${this.dir}${convertedFileName}`),
				url: `/${this.path}/${convertedFileName}`
			}).fetch();

			// delete origin upload file
			setTimeout(() => {
				try {
					fs.unlinkSync(file.fd)
					console.log('File is deleted.');
				} catch (err) {
					console.error(err);
				}
			}, 300)

			resFile = `${this.dir}${convertedFileName}`
			resFilename = convertedFileName
			resMIME = config.convert
		} else {
			//create parent file origin
			parent = await MediaManagerAP.create({
				parent: null,
				mimeType: file.type,
				size: file.size,
				path: file.fd,
				cropType: 'origin',
				filename: origFileName,
				meta: meta.id,
				image_size: sizeOf(file.fd),
				url: url
			}).fetch();
		}

		return {
			parentDB: parent,
			resFile: resFile,
			resFilename: resFilename,
			resMIME: resMIME
		}
	}

	protected checkConvert(config: config, file: UploaderFile) {
		return config.convert && (config.convert === 'image/webp' || config.convert === 'image/jpeg') && config.convert !== file.type && file.type !== 'image/webp'
	}

	protected getConvertExtensions(s: string): string {
		const obj: { [key: string]: string } = {
			"image/jpeg": "jpg",
			"image/webp": "webp"
		}
		return obj[s]
	}

	protected async createSizes(parent: {
		id: string,
		size: { width: number, height: number }
	}, filename: string, file: string, MIME: string, config: config, origFileName: string) {
		//create thumb
		const thumbName = randomFileName(filename, '_thumb')
		const thumb = await this.resizeImage(file, `${this.dir}${thumbName}`, 150, 150)

		await MediaManagerAP.create({
			parent: parent.id,
			mimeType: MIME,
			size: thumb.size,
			cropType: 'thumb',
			path: `${this.dir}${thumbName}`,
			filename: origFileName,
			image_size: sizeOf(`${this.dir}${thumbName}`),
			url: `/${this.path}/${thumbName}`
		})

		if (config.sizes.length) { // create sizes
			for (const confSize of config.sizes) {
				let sizeName = randomFileName(filename, `_${Object.keys(confSize)[0]}`)
				let {width, height} = confSize[Object.keys(confSize)[0]]
				if (parent.size.width < width || parent.size.height < height) continue
				let size = await this.resizeImage(file, `${this.dir}${sizeName}`, width, height)
				await MediaManagerAP.create({
					parent: parent.id,
					mimeType: MIME,
					size: size.size,
					filename: origFileName,
					path: `${this.dir}${sizeName}`,
					cropType: Object.keys(confSize)[0],
					image_size: sizeOf(`${this.dir}${sizeName}`),
					url: `/${this.path}/${sizeName}`
				})
			}
		}
	}

	// protected async convertImage(input: string, output: string,) {
	// 	return await sharp(input)
	// 		.toFile(output)
	// }
	//
	// protected async resizeImage(input: string, output: string, width: number, height: number) {
	// 	return await sharp(input)
	// 		.resize({width: width, height: height})
	// 		.toFile(output)
	// }

	// public async setMeta(req: ReqType, res: ResType): Promise<sails.Response> {
	// 	const data = req.body.data
	// 	const id = req.body.metaId
	//
	// 	try {
	// 		await MediaManagerMetaAP.update({id: id}, data)
	// 		return res.send({
	// 			msg: "success",
	// 		})
	// 	} catch (e) {
	// 		console.log(e)
	// 	}
	// }

	// public async getMeta(req: ReqType, res: ResType): Promise<sails.Response> {
	// 	const data = req.body
	// 	const fields: Meta = {
	// 		author: "",
	// 		description: "",
	// 		title: ""
	// 	}
	// 	return res.send({
	// 		data: (await MediaManagerMetaAP.find({where: {id: data.metaId}}))[0],
	// 		fields: fields
	// 	})
	// }
}
