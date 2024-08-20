import * as sharp from "sharp";

export interface Item {
	id: string
	parent: string
	children: Item[]
	mimeType: string
	path: string
	size: number
	image_size: {
		width: number,
		height: number,
		type: string
	},
	cropType: 'thumb' | string
	url: string
	filename: string
	/**
	 * @param {string} meta - Assoc model id
	 */
	meta: string
}

export interface UploaderFile {
	fd: string
	size: number
	type: string
	filename: string
	status: string
	field: string
	extra: string | undefined
}

export interface imageSizes {
	[key: string]: {
		width: number
		height: number
	}
}

export abstract class File<T extends Item> {
	public abstract id: string
	public abstract type:
		"application" |
		"audio" |
		"example" |
		"image" |
		"message" |
		"model" |
		"multipart" |
		"text" |
		"video"

	public path: string
	public dir: string
	public model: string
	public metaModel: string

	protected constructor(path: string, dir: string, model: string, metaModel: string) {
		this.path = path
		this.dir = dir
		this.model = model
		this.metaModel = metaModel
	}

	public abstract upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes): Promise<T>
	public abstract getMeta(id: string): Promise<{key: string, value: string}[]>
	public abstract setMeta(id: string, data: {[key: string]: string}): Promise<{msg: "success"}>
	protected abstract createThumb(parentId: string, file: UploaderFile, filename: string, origFileName: string,): Promise<void>

	protected async convertImage(input: string, output: string,) {
		return await sharp(input)
			.toFile(output)
	}

	protected async resizeImage(input: string, output: string, width: number, height: number) {
		return await sharp(input)
			.resize({width: width, height: height})
			.toFile(output)
	}
}

export abstract class AbstractMediaManager {
	public id: string
	public path: string
	public dir: string
	public model: string
	public readonly itemTypes: File<Item>[] = [];

	protected constructor(id: string, path: string, dir: string, model: string) {
		this.id = id
		this.path = path
		this.dir = dir
		this.model = model
	}

	public upload(file: UploaderFile, filename: string, origFileName: string, imageSizes: imageSizes) {
		const mimeType = file.type;
		const parts = mimeType.split('/');
		return this.getItemType(parts[0])?.upload(file, filename, origFileName, imageSizes)
	}

	protected getItemType(type: string) {
		return this.itemTypes.find((it) => it.type === type);
	}

	public abstract getLibrary(limit: number, skip: number, sort: string): Promise<{ data: Item[], next: boolean }>

	public abstract getChildren(req: ReqType, res: ResType): Promise<sails.Response>


	public getMeta(id: string, mimeType: string): Promise<{key: string, value: string}[]>{
		const parts = mimeType.split('/');
		return this.getItemType(parts[0])?.getMeta(id)
	}

	public setMeta(id: string, mimeType: string, data: {[key: string]: string}): Promise<{msg: "success"}>{
		const parts = mimeType.split('/');
		return this.getItemType(parts[0])?.setMeta(id, data)
	}

	public abstract uploadCropped(req: ReqType, res: ResType): Promise<sails.Response | void>
}
