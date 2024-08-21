"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMediaManager = exports.File = void 0;
class File {
    constructor(path, dir, model, metaModel) {
        this.path = path;
        this.dir = dir;
        this.model = model;
        this.metaModel = metaModel;
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
    getChildren(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.getChildren(item.id);
    }
    uploadCropped(item, file, fileName, config) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.uploadCropped(item, file, fileName, config);
    }
    getMeta(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.getMeta(item.id);
    }
    setMeta(item, data) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.setMeta(item.id, data);
    }
    delete(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.delete(item.id);
    }
}
exports.AbstractMediaManager = AbstractMediaManager;
