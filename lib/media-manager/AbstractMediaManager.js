"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMediaManager = exports.File = void 0;
class File {
    // TODO: надо удалить model из конструктора, и metaModel
    constructor(path, dir) {
        this.path = path;
        this.dir = dir;
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
    constructor(id, path, dir) {
        this.itemTypes = [];
        this.id = id;
        this.path = path;
        this.dir = dir;
    }
    /**
     * Upload an item.
     * @param file
     * @param filename
     * @param origFileName
     * @param imageSizes
     * @param group
     */
    upload(file, filename, origFileName, group) {
        const mimeType = file.type;
        const parts = mimeType.split("/");
        return this.getItemType(parts[0])?.upload(file, filename, origFileName, group);
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
     * @param group?
     */
    getItems(type, limit, skip, sort, group) {
        return this.getItemType(type)?.getItems(limit, skip, sort, group);
    }
    /**
     * Search items by type.
     * @param s
     * @param type
     */
    searchItems(s, type, group) {
        return this.getItemType(type)?.search(s, group);
    }
    /**
     * Get children of an item.
     * @param item
     */
    getVariants(item) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.getVariants(item.id);
    }
    /**
     * Upload cropped image.
     * @param item
     * @param file
     * @param fileName
     * @param config
     */
    uploadVariant(item, file, fileName, config, group) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.uploadVariant(item, file, fileName, config, group);
    }
    /**
     * Get metadata of an item.
     * @param item
     */
    getMeta(item) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.getMeta(item.id);
    }
    getOrigin(id) {
        return this.getItemType("image")?.getOrirgin(id);
    }
    /**
     *  Set metadata of an item.
     * @param item
     * @param data
     */
    setMeta(item, data) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.setMeta(item.id, data);
    }
    /**
     * Delete an item.
     * @param item
     */
    delete(item) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.delete(item.id);
    }
}
exports.AbstractMediaManager = AbstractMediaManager;