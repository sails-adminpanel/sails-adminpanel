import { AbstractMediaManager, Item } from "../../lib/media-manager/AbstractMediaManager";
import { randomFileName } from "../../lib/media-manager/helpers/MediaManagerHelper";
import { MediaManagerConfig } from "../../interfaces/adminpanelConfig";

export class MediaManagerAdapter {
    protected manager: AbstractMediaManager;

    constructor(manager: AbstractMediaManager) {
        this.manager = manager;
    }

    public async delete(req: ReqType, res: ResType) {
        await this.manager.delete(req.body.item);
        return res.send({ msg: "ok" });
    }

    public async get(req: ReqType, res: ResType) {
        let type = req.query.type as string;
        interface resultType {
            data: Item[];
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

    public async search(req: ReqType, res: ResType) {
        let s = req.body.s as string;
        let type = req.body.type as string;
        let data: Item[];
        if (type === "all") {
            data = await this.manager.searchAll(s);
        } else {
            data = await this.manager.searchItems(s, type);
        }
        return res.send({ data: data });
    }

    public async getVariants(req: ReqType, res: ResType) {
        return res.send({
            data: await this.manager.getVariants(req.body.item),
        });
    }

    public async uploadCropped(req: ReqType, res: ResType) {
        const item: Item = JSON.parse(req.body.item);
        const config = JSON.parse(req.body.config);
        let filename = randomFileName(req.body.name, "", true);
        const group = req.body.group as string
        req.file("file").upload(
            {
                dirname: this.manager.dir,
                saveAs: filename,
            },
            async (err, file) => {
                if (err) return res.serverError(err);
                try {
                    return res.send({
                        data: await this.manager.uploadVariant(
                            item,
                            file[0],
                            filename,
                            config,
                            group
                        ),
                    });
                } catch (e) {
                    console.error(e);
                }
            },
        );
    }

    public async upload(req: ReqType, res: ResType) {
        const config: MediaManagerConfig | null = sails.config.adminpanel.mediamanager || null;
        const group = req.body.group as string

        //@ts-ignore
        const upload = req.file("file")._files[0].stream,
            headers = upload.headers,
            byteCount = upload.byteCount,
            settings = {
                allowedTypes: config?.allowMIME ?? [],
                maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024, // 2 Mb
            };
        let validated: boolean = true;
        let isDefault = this.manager.id === "default";

        if (isDefault) {
            // Check file type
            if (
                settings.allowedTypes.length &&
                this.checkMIMEType(
                    settings.allowedTypes,
                    headers["content-type"],
                )
            ) {
                validated = false;
                res.send({
                    msg: "Wrong filetype (" + headers["content-type"] + ").",
                });
            }
            // Check file size
            if (byteCount > settings.maxBytes) {
                validated = false;
                res.send({
                    msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`,
                });
            }
        }

        if (validated) {
            let filename = randomFileName(req.body.name.replace(" ", "_"), "", true);
            let origFileName = req.body.name.replace(/\.[^\.]+$/, "");

            //save file
            req.file("file").upload({ dirname: this.manager.dir, saveAs: filename }, async (err, file) => {
                if (err) return res.serverError(err);
                try {
                    let item = await this.manager.upload(file[0], filename, origFileName, group);

                    return res.send({
                        msg: "success",
                        data: item,
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            );
        }
    }

    public async getMeta(req: ReqType, res: ResType) {
        return res.send({ data: await this.manager.getMeta(req.body.item) });
    }

    public async setMeta(req: ReqType, res: ResType) {
        try {
            await this.manager.setMeta(req.body.item, req.body.data)
            return res.send({ massage: 'ok' });
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