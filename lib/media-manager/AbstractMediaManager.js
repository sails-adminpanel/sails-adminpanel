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
/**
 *
 * ░█████╗░██████╗░░██████╗████████╗██████╗░░█████╗░░█████╗░████████╗
 * ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
 * ███████║██████╦╝╚█████╗░░░░██║░░░██████╔╝███████║██║░░╚═╝░░░██║░░░
 * ██╔══██║██╔══██╗░╚═══██╗░░░██║░░░██╔══██╗██╔══██║██║░░██╗░░░██║░░░
 * ██║░░██║██████╦╝██████╔╝░░░██║░░░██║░░██║██║░░██║╚█████╔╝░░░██║░░░
 * ╚═╝░░╚═╝╚═════╝░╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░
 *
 * ███╗░░░███╗███████╗██████╗░██╗░█████╗░███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗██████╗░
 * ████╗░████║██╔════╝██╔══██╗██║██╔══██╗████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝██╔══██╗
 * ██╔████╔██║█████╗░░██║░░██║██║███████║██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██████╔╝
 * ██║╚██╔╝██║██╔══╝░░██║░░██║██║██╔══██║██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██╔══██╗
 * ██║░╚═╝░██║███████╗██████╔╝██║██║░░██║██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░░██║
 * ╚═╝░░░░░╚═╝╚══════╝╚═════╝░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░╚═╝
 */
class AbstractMediaManager {
    /**
     * @param id
     * @param path
     * @param dir
     * @param model
     * @param modelAssoc
     * @protected
     */
    constructor(id, path, dir, model, modelAssoc) {
        this.itemTypes = [];
        this.id = id;
        this.path = path;
        this.dir = dir;
        this.model = model;
        this.modelAssoc = modelAssoc;
    }
    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     */
    upload(file, filename, origFileName, imageSizes) {
        const mimeType = file.type;
        const parts = mimeType.split('/');
        return this.getItemType(parts[0])?.upload(file, filename, origFileName, imageSizes);
    }
    /**
     * Get item type.
     * @param type
     * @protected
     */
    getItemType(type) {
        return this.itemTypes.find((it) => it.type === type);
    }
    /**
     * Get items of a type.
     * @param type
     * @param limit
     * @param skip
     * @param sort
     */
    getItems(type, limit, skip, sort) {
        return this.getItemType(type)?.getItems(limit, skip, sort);
    }
    /**
     * Search items by type.
     * @param s
     * @param type
     */
    searchItems(s, type) {
        return this.getItemType(type)?.search(s);
    }
    /**
     * Get children of an item.
     * @param item
     */
    getChildren(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.getChildren(item.id);
    }
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    uploadCropped(item, file, fileName, config) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.uploadCropped(item, file, fileName, config);
    }
    /**
     * Get metadata of an item.
     * @param item
     */
    getMeta(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.getMeta(item.id);
    }
    /**
     *  Set metadata of an item.
     * @param item
     * @param data
     */
    setMeta(item, data) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.setMeta(item.id, data);
    }
    /**
     * Delete an item.
     * @param item
     */
    delete(item) {
        const parts = item.mimeType.split('/');
        return this.getItemType(parts[0])?.delete(item.id);
    }
}
exports.AbstractMediaManager = AbstractMediaManager;
