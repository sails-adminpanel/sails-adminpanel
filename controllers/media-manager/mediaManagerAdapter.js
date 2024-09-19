"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManagerAdapter = void 0;
const MediaManagerHelper_1 = require("../../lib/media-manager/helpers/MediaManagerHelper");
class MediaManagerAdapter {
    constructor(manager) {
        this.manager = manager;
    }
    async delete(req, res) {
        await this.manager.delete(req.body.item);
        return res.send({ msg: "ok" });
    }
    async get(req, res) {
        let type = req.query.type;
        let result;
        if (type === "all") {
            result = (await this.manager.getAll(+req.query.count, +req.query.skip, "createdAt DESC", req.query.group));
        }
        else {
            result = (await this.manager.getItems(type, +req.query.count, +req.query.skip, "createdAt DESC", req.query.group));
        }
        return res.send({
            data: result.data,
            next: !!result.next,
        });
    }
    async search(req, res) {
        let s = req.body.s;
        let type = req.body.type;
        let data;
        if (type === "all") {
            data = await this.manager.searchAll(s);
        }
        else {
            data = await this.manager.searchItems(s, type);
        }
        return res.send({ data: data });
    }
    async getVariants(req, res) {
        return res.send({
            data: await this.manager.getVariants(req.body.item),
        });
    }
    async uploadVariant(req, res) {
        const item = JSON.parse(req.body.item);
        let filename = (0, MediaManagerHelper_1.randomFileName)(req.body.name, "", true);
        const group = req.body.group;
        const isCropped = req.body.isCropped;
        if (!isCropped) {
            const config = sails.config.adminpanel.mediamanager || null;
            //@ts-ignore
            const upload = req.file("file")._files[0].stream, headers = upload.headers, byteCount = upload.byteCount, settings = {
                allowedTypes: config?.allowMIME ?? [],
                maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024, // 2 Mb
            };
            // Check file type
            if (settings.allowedTypes.length && this.checkMIMEType(settings.allowedTypes, headers["content-type"])) {
                res.send({
                    msg: "Wrong filetype (" + headers["content-type"] + ").",
                });
                return;
            }
            // Check file size
            if (byteCount > settings.maxBytes) {
                res.send({
                    msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`,
                });
                return;
            }
        }
        req.file("file").upload({ dirname: this.manager.dir, saveAs: filename }, async (err, file) => {
            if (err)
                return res.serverError(err);
            try {
                return res.send({
                    msg: "success",
                    data: await this.manager.uploadVariant(item, file[0], filename, group, req.body.localeId),
                });
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    async upload(req, res) {
        const config = sails.config.adminpanel.mediamanager || null;
        const group = req.body.group;
        //@ts-ignore
        const upload = req.file("file")._files[0].stream, headers = upload.headers, byteCount = upload.byteCount, settings = {
            allowedTypes: config?.allowMIME ?? [],
            maxBytes: config?.maxByteSize ?? 2 * 1024 * 1024, // 2 Mb
        };
        let isDefault = this.manager.id === "default";
        if (isDefault) {
            // Check file type
            if (settings.allowedTypes.length && this.checkMIMEType(settings.allowedTypes, headers["content-type"])) {
                // validated = false;
                res.send({
                    msg: "Wrong filetype (" + headers["content-type"] + ").",
                });
                return;
            }
            // Check file size
            if (byteCount > settings.maxBytes) {
                // validated = false;
                res.send({
                    msg: `The file size is larger than the allowed value: ${+settings.maxBytes / 1024 / 1024} Mb`,
                });
                return;
            }
        }
        // if (validated) {
        let filename = (0, MediaManagerHelper_1.randomFileName)(req.body.name.replace(" ", "_"), "", true);
        let origFileName = req.body.name.replace(/\.[^\.]+$/, "");
        //save file
        req.file("file").upload({ dirname: this.manager.dir, saveAs: filename }, async (err, file) => {
            if (err)
                return res.serverError(err);
            try {
                let item = await this.manager.upload(file[0], filename, origFileName, group);
                return res.send({
                    msg: "success",
                    data: item,
                });
            }
            catch (e) {
                console.error(e);
            }
        });
        // }
    }
    async getMeta(req, res) {
        return res.send({ data: await this.manager.getMeta(req.body.item) });
    }
    async setMeta(req, res) {
        try {
            await this.manager.setMeta(req.body.item, req.body.data);
            res.send({ massage: 'ok' });
            return;
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Check file type. Return false if the type is allowed.
     * @param allowedTypes
     * @param type
     */
    checkMIMEType(allowedTypes, type) {
        const partsFileType = type.split("/");
        const allowedType = `${partsFileType[0]}/*`;
        if (allowedTypes.includes(allowedType))
            return false;
        return !allowedTypes.includes(type);
    }
}
exports.MediaManagerAdapter = MediaManagerAdapter;
