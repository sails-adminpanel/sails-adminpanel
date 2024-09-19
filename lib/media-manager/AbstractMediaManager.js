"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMediaManager = exports.File = void 0;
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
class File {
    /**
     *
     * @param path
     * @param dir
     */
    constructor(urlPathPrefix, fileStoragePath) {
        this.path = urlPathPrefix;
        this.dir = fileStoragePath;
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
     * @protected
     */
    constructor() {
        this.itemTypes = [];
        this._bindAccessRight();
    }
    _bindAccessRight() {
        setTimeout(() => {
            accessRightsHelper_1.AccessRightsHelper.registerToken({
                id: `mediaManager-${this.id}`,
                name: this.id,
                description: `Access to edit catalog for ${this.id}`,
                department: 'catalog'
            });
        }, 100);
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
        const item = this.getItemType(parts[0]);
        if (item) {
            return item.upload(file, filename, origFileName, group);
        }
        else {
            throw `item not found for \`${parts[0]}\` in ${JSON.stringify(this.itemTypes.map((i) => i.type))}`;
        }
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
    uploadVariant(item, file, fileName, group, localeId) {
        const parts = item.mimeType.split("/");
        return this.getItemType(parts[0])?.uploadVariant(item, file, fileName, group, localeId);
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
