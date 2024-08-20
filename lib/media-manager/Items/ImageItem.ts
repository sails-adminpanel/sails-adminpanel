import {File, Item, UploaderFile, imageSizes} from '../AbstractMediaManager'
import {randomFileName} from "../helpers/MediaManagerHelper";
import sizeOf from "image-size";

interface Meta {
	[key: string]: string
}

export class ImageItem extends File<Item>{
	public id: string;
	public type: "application" | "audio" | "example" | "image" | "message" | "model" | "multipart" | "text" | "video" = "image";

	constructor(path: string, dir: string, model: string, metaModel: string) {
		super( path, dir, model, metaModel);
	}

	public async upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes): Promise<Item> {
		let parent: Item = await sails.models[this.model].create({
			parent: null,
			mimeType: file.type,
			size: file.size,
			path: file.fd,
			cropType: 'origin',
			filename: origFileName,
			image_size: sizeOf(file.fd),
			url: `/${this.path}/${filename}`
		}).fetch();

		await this.createEmptyMeta(parent.id)

		await this.createThumb(parent.id, file, filename, origFileName)

		return sails.models[this.model].find({
			where: {id: parent.id}
		}).populate('children') as Item;
	}

	protected async createThumb(parentId: string, file: UploaderFile, filename: string, origFileName: string): Promise<void> {
		const thumbName = randomFileName(filename, '_thumb')
		const thumb = await this.resizeImage(file.fd, `${this.dir}${thumbName}`, 150, 150)

		await sails.models[this.model].create({
			parent: parentId,
			mimeType: file.type,
			size: thumb.size,
			cropType: 'thumb',
			path: `${this.dir}${thumbName}`,
			filename: origFileName,
			image_size: sizeOf(`${this.dir}${thumbName}`),
			url: `/${this.path}/${thumbName}`
		})
	}

	protected async createEmptyMeta(id: string) {
		//create empty meta
		let metaData: Meta = {
			author: "",
			description: "",
			title: ""
		}

		for (const key of Object.keys(metaData)) {
			await sails.models[this.metaModel].create({
				key: key,
				value: metaData[key],
				parent: id
			})
		}
	}

	public async getMeta(id: string): Promise<{key: string, value: string}[]> {
		return (await sails.models[this.model].findOne(id).populate('meta')).meta
	}

	async setMeta(id: string, data: { [p: string]: string }): Promise<{ msg: "success" }> {
		for (const key of Object.keys(data)) {
			await sails.models[this.metaModel].update({parent: id, key: key}, {value: data[key]})
		}
		return {msg: "success"}
	}

}
