import {AbstractMediaManager, imageSizes, Item} from "../../lib/media-manager/AbstractMediaManager";
import _ = require("lodash");
import {randomFileName} from "../../lib/media-manager/helpers/MediaManagerHelper";
import {MediaManagerConfig} from "../../interfaces/adminpanelConfig";
import sizeOf from "image-size";

export class MediaManagerAdapter {
	protected manager: AbstractMediaManager

	constructor(manager: AbstractMediaManager) {
		this.manager = manager
	}

	public async delete(req: ReqType, res: ResType) {
		await this.manager.delete(req.body.item)
		return res.send({msg:'ok'})
	}

	public async getAll(req: ReqType, res: ResType) {
		let {data, next} = await this.manager.getAll(+req.param('count'), +req.param('skip'), 'createdAt DESC')
		return res.send({
			data: data,
			next: !!next
		})
	}

	public async getChildren(req: ReqType, res: ResType) {
		return res.send({
			data: await this.manager.getChildren(req.body.item)
		})
	}

	public async uploadCropped(req: ReqType, res: ResType) {
		const item: Item = JSON.parse(req.body.item)
		const config = JSON.parse(req.body.config)
		let filename = randomFileName(req.body.name, '', true)
		req.file('file').upload({
			dirname: this.manager.dir,
			saveAs: filename
		}, async (err, file) => {
			if (err) return res.serverError(err)
			try {
				return res.send({
					data: await this.manager.uploadCropped(item, file[0], filename, config)
				})
			} catch (e) {
				console.error(e)
			}
		})
	}

	public async upload(req: ReqType, res: ResType) {
		const config: MediaManagerConfig | null = sails.config.adminpanel.mediamanager || null
		//@ts-ignore
		const upload = req.file('file')._files[0].stream,
			headers = upload.headers,
			byteCount = upload.byteCount,
			settings = {
				allowedTypes: config?.allowMIME ?? [],
				maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024 // 2 Mb
			};
		let validated: boolean = true
		let isDefault = this.manager.id === 'default'

		let imageSizes = {}
		if (isDefault) {
			imageSizes = config?.imageSizes ?? {}
			// Check file type
			if (settings.allowedTypes.length && this.checkMIMEType(settings.allowedTypes, headers['content-type'])) {
				validated = false;
				res.send({msg: 'Wrong filetype (' + headers['content-type'] + ').'})
			}
			// Check file size
			if (byteCount > settings.maxBytes) {
				validated = false;
				res.send({msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`});
			}
		}

		if (validated) {
			let filename = randomFileName(req.body.name.replace(' ', '_'), '', true)
			let origFileName = req.body.name.replace(/\.[^\.]+$/, '')
			//save file
			req.file('file').upload({
				dirname: this.manager.dir,
				saveAs: filename
			}, async (err, file) => {
				if (err) return res.serverError(err);
				try {
					return res.send({
						msg: "success",
						data: await this.manager.upload(file[0], filename, origFileName, imageSizes)
					})
				} catch (e) {
					console.error(e)
				}
			})
		}
	}

	public async getMeta(req: ReqType, res: ResType) {
		return res.send({data: await this.manager.getMeta(req.body.item)})
	}

	public async setMeta(req: ReqType, res: ResType) {
		return res.send({data: await this.manager.setMeta(req.body.item, req.body.data)})
	}

	/**
	 * Check file type. Return false if the type is allowed.
	 * @param allowedTypes
	 * @param type
	 */
	public checkMIMEType(allowedTypes: string[], type: string) {
		const partsFileType = type.split('/');
		const allowedType = `${partsFileType[0]}/*`;
		if (allowedTypes.includes(allowedType)) return false
		return !allowedTypes.includes(type);
	}
}
