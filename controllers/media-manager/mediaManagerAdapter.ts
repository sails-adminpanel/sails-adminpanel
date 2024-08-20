import {AbstractMediaManager, Item} from "../../lib/media-manager/AbstractMediaManager";
import _ = require("lodash");
import {randomFileName} from "../../lib/media-manager/helpers/MediaManagerHelper";
import {MediaManagerConfig} from "../../interfaces/adminpanelConfig";

export class MediaManagerAdapter {
	protected manager: AbstractMediaManager

	constructor(manager: AbstractMediaManager) {
		this.manager = manager
	}

	public async getLibrary(req: ReqType, res: ResType) {
		let {data, next} = await this.manager.getLibrary(+req.param('count'), +req.param('skip'), 'createdAt DESC')
		return res.send({
			data: data,
			next: !!next
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

		// Check file type
		if (settings.allowedTypes.length && _.indexOf(settings.allowedTypes, headers['content-type']) === -1) {
			validated = false;
			res.send({msg: 'Wrong filetype (' + headers['content-type'] + ').'})
		}
		// Check file size
		if (byteCount > settings.maxBytes) {
			validated = false;
			res.send({msg: 'Filesize exceeded: ' + byteCount + '/' + settings.maxBytes + '.'});
		}

		if (validated) {
			let filename = randomFileName(req.body.name.replace(' ', '_'), '')
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
						data: await this.manager.upload(file[0], filename, origFileName, config.imageSizes)
					})
				} catch (e) {
					console.error(e)
				}
			})
		}
	}

	public async getMeta(req: ReqType, res: ResType) {
		return res.send({data: await this.manager.getMeta(req.body.id, req.body.mimeType)})
	}

	public async setMeta(req: ReqType, res: ResType){
		return res.send({data: await this.manager.setMeta(req.body.id, req.body.mimeType, req.body.data)})
	}
}
