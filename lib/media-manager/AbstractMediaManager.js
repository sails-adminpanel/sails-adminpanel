"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMediaManager = exports.File = void 0;
const sharp = require("sharp");
class File {
    constructor(path, dir, model, metaModel) {
        this.path = path;
        this.dir = dir;
        this.model = model;
        this.metaModel = metaModel;
    }
    async convertImage(input, output) {
        return await sharp(input)
            .toFile(output);
    }
    async resizeImage(input, output, width, height) {
        return await sharp(input)
            .resize({ width: width, height: height })
            .toFile(output);
    }
}
exports.File = File;
class AbstractMediaManager {
    constructor(id, path, dir, model) {
        this.itemTypes = [];
        this.id = id;
        this.path = path;
        this.dir = dir;
        this.model = model;
    }
    upload(file, filename, origFileName, imageSizes) {
        const mimeType = file.type;
        const parts = mimeType.split('/');
        return this.getItemType(parts[0])?.upload(file, filename, origFileName, imageSizes);
    }
    getItemType(type) {
        return this.itemTypes.find((it) => it.type === type);
    }
    getMeta(id, mimeType) {
        const parts = mimeType.split('/');
        return this.getItemType(parts[0])?.getMeta(id);
    }
    setMeta(id, mimeType, data) {
        const parts = mimeType.split('/');
        return this.getItemType(parts[0])?.setMeta(id, data);
    }
}
exports.AbstractMediaManager = AbstractMediaManager;
