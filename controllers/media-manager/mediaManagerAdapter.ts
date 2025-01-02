import { AbstractMediaManager, MediaManagerItem } from "../../lib/media-manager/AbstractMediaManager";
import { randomFileName } from "../../lib/media-manager/helpers/MediaManagerHelper";
import { MediaManagerConfig } from "../../interfaces/adminpanelConfig";

export class MediaManagerAdapter {
    protected manager: AbstractMediaManager;

    constructor(manager: AbstractMediaManager) {
        this.manager = manager;
    }

    public async delete(req: ReqTypeAP, res: ResTypeAP) {
        await this.manager.delete(req.body.item);
        return res.send({ msg: "ok" });
    }

    public async get(req: ReqTypeAP, res: ResTypeAP) {
        let type = req.query.type as string;
        interface resultType {
            data: MediaManagerItem[];
            next: boolean;
        }
        let result: resultType;
        if (type === "all") {
            result = (await this.manager.getAll(
                +req.query.count,
                +req.query.skip,
                "createdAt DESC",
                req.query.group
            )) as resultType;
        } else {
            result = (await this.manager.getItems(
                type,
                +req.query.count,
                +req.query.skip,
                "createdAt DESC",
                req.query.group
            )) as resultType;
        }
        return res.send({
            data: result.data,
            next: !!result.next,
        });
    }

    public async search(req: ReqTypeAP, res: ResTypeAP) {
        let s = req.body.s as string;
        let type = req.body.type as string;
        let data: MediaManagerItem[];
        if (type === "all") {
            data = await this.manager.searchAll(s);
        } else {
            data = await this.manager.searchItems(s, type);
        }
        return res.send({ data: data });
    }

    public async getVariants(req: ReqTypeAP, res: ResTypeAP) {
        return res.send({
            data: await this.manager.getVariants(req.body.item),
        });
    }

    public async uploadVariant(req: ReqTypeAP, res: ResTypeAP): Promise<void> {
        const item: MediaManagerItem = JSON.parse(req.body.item);
        let filename = randomFileName(req.body.name, "", true);
        const group = req.body.group as string
        const isCropped = req.body.isCropped

        if (!isCropped) {
            const config: MediaManagerConfig | null = adminizer.config.mediamanager || null;

            //@ts-ignore
            const upload = req.file("file")._files[0].stream,
                headers = upload.headers,
                byteCount = upload.byteCount,
                settings = {
                    allowedTypes: config?.allowMIME ?? [],
                    maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024, // 2 Mb
                };
            // Check file type
            if (settings.allowedTypes.length && this.checkMIMEType(settings.allowedTypes, headers["content-type"])) {
                res.send({
                    msg: "Wrong filetype (" + headers["content-type"] + ").",
                });
                return 
            }
            // Check file size
            if (byteCount > settings.maxBytes) {
                res.send({
                    msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`,
                });
                return 
            }

        }
        // Todo: this.manager.dir manager temp dir
        req.file("file").upload({ dirname: this.manager.dir, saveAs: filename }, async (err, file) => {
            if (err) return res.serverError(err);
            try {
                return res.send({
                    msg: "success",
                    data: await this.manager.uploadVariant(
                        item,
                        file[0],
                        filename,
                        group,
                        req.body.localeId
                    ),
                });
            } catch (e) {
                console.error(e);
            }
        });
    }

    public async upload(req: ReqTypeAP, res: ResTypeAP): Promise<void> {
        const config: MediaManagerConfig | null = adminizer.config.mediamanager || null;
        const group = req.body.group as string

        //@ts-ignore
        const upload = req.file("file")._files[0].stream,
            headers = upload.headers,
            byteCount = upload.byteCount,
            settings = {
                allowedTypes: config?.allowMIME ?? [],
                maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024, // 2 Mb
            };
        let isDefault = this.manager.id === "default";

        // TODO: add from abstract
        if (isDefault) {
            // Check file type
            if (settings.allowedTypes.length && this.checkMIMEType(settings.allowedTypes, headers["content-type"])) {
                // validated = false;
                res.send({
                    msg: "Wrong filetype (" + headers["content-type"] + ").",
                });
                return 
            }
            // Check file size
            if (byteCount > settings.maxBytes) {
                // validated = false;
                res.send({
                    msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`,
                });
                return 
            }
        }

        // if (validated) {
        let filename = randomFileName(req.body.name.replace(" ", "_"), "", true);
        let origFileName = req.body.name.replace(/\.[^\.]+$/, "");

        //save file
        // TODO: create dir if not exist ${process.cwd()}/.tmp/uploads
        req.file("file").upload({ dirname: `${process.cwd()}/.tmp/uploads`, saveAs: filename }, async (err, file) => {
            if (err) return res.serverError(err);
            try {
                let item = await this.manager.upload(file[0], filename, origFileName, group);
                console.log(item)
                if(item) {
                    return res.send({
                        msg: "success",
                        data: item,
                    });
                } else {
                    return res.serverError(`The file was not processed, check manager.upload`);
                }
            } catch (e) {
                console.error(e);
                return res.serverError(`error:`, e)
            }
        });
        // }
    }

    public async getMeta(req: ReqTypeAP, res: ResTypeAP) {
        return res.send({ data: await this.manager.getMeta(req.body.item) });
    }

    public async setMeta(req: ReqTypeAP, res: ResTypeAP): Promise<void> {
        try {
            await this.manager.setMeta(req.body.item, req.body.data)
            res.send({ massage: 'ok' });
            return 
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Check file type. Return false if the type is allowed.
     * @param allowedTypes
     * @param type
     */
    public checkMIMEType(allowedTypes: string[], type: string) {
        const partsFileType = type.split("/");
        const allowedType = `${partsFileType[0]}/*`;
        if (allowedTypes.includes(allowedType)) return false;
        return !allowedTypes.includes(type);
    }
}
