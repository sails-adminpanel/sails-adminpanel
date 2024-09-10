"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoItem = exports.ApplicationItem = exports.TextItem = exports.ImageItem = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const MediaManagerHelper_1 = require("./helpers/MediaManagerHelper");
const image_size_1 = require("image-size");
const sharp = require("sharp");
class ImageItem extends AbstractMediaManager_1.File {
    constructor(path, dir) {
        super(path, dir);
        this.type = "image";
        this.model = "mediamanagerap";
        this.metaModel = "mediamanagermetaap";
    }
    async getItems(limit, skip, sort) {
        let data = await sails.models[this.model]
            .find({
            where: { parent: null, mimeType: { contains: this.type } },
            limit: limit,
            skip: skip,
            sort: sort,
        })
            .populate("children", { sort: sort });
        let next = (await sails.models[this.model].find({
            where: { parent: null, mimeType: { contains: this.type } },
            limit: limit,
            skip: skip === 0 ? limit : skip + limit,
            sort: sort,
        })).length;
        return {
            data: data,
            next: !!next,
        };
    }
    async search(s) {
        return await sails.models[this.model]
            .find({
            where: {
                filename: { contains: s },
                mimeType: { contains: this.type },
                parent: null,
            },
            sort: "createdAt DESC",
        })
            .populate("children", { sort: "createdAt DESC" });
    }
    async upload(file, filename, origFileName) {
        let parent = await sails.models[this.model]
            .create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            cropType: "origin",
            filename: origFileName,
            image_size: (0, image_size_1.default)(file.fd),
            url: `/${this.path}/${filename}`,
        })
            .fetch();
        await this.createEmptyMeta(parent.id);
        return (await sails.models[this.model]
            .find({
            where: { id: parent.id },
        })
            .populate("children"));
    }
    async getChildren(id) {
        return (await sails.models[this.model]
            .findOne({
            where: { id: id },
        })
            .populate("children", { sort: "createdAt DESC" })).children;
    }
    async createVariants(file, parent, filename, imageSizes) {
        for (const sizeKey of Object.keys(imageSizes)) {
            let sizeName = (0, MediaManagerHelper_1.randomFileName)(filename, sizeKey, false);
            let { width, height } = imageSizes[sizeKey];
            if (parent.image_size.width < width ||
                parent.image_size.height < height)
                continue;
            let newFile = await this.resizeImage(file.fd, `${this.dir}${sizeName}`, width, height);
            await sails.models[this.model].create({
                parent: parent.id,
                mimeType: parent.mimeType,
                size: newFile.size,
                filename: parent.filename,
                path: `${this.dir}${sizeName}`,
                cropType: sizeKey,
                image_size: (0, image_size_1.default)(`${this.dir}${sizeName}`),
                url: `/${this.path}/${sizeName}`,
            });
        }
    }
    async getOrirgin(id) {
        return (await sails.models[this.model].findOne({
            where: { id: id },
        })).path;
    }
    async createEmptyMeta(id) {
        //create empty meta
        let metaData = {
            author: "",
            description: "",
            title: "",
        };
        for (const key of Object.keys(metaData)) {
            await sails.models[this.metaModel].create({
                key: key,
                value: metaData[key],
                parent: id,
            });
        }
    }
    async getMeta(id) {
        return (await sails.models[this.model].findOne(id).populate("meta"))
            .meta;
    }
    async setMeta(id, data) {
        for (const key of Object.keys(data)) {
            await sails.models[this.metaModel].update({ parent: id, key: key }, { value: data[key] });
        }
        return { msg: "success" };
    }
    async resizeImage(input, output, width, height) {
        return await sharp(input)
            .resize({ width: width, height: height })
            .toFile(output);
    }
    async uploadVarinat(parent, file, filename, config) {
        return await sails.models[this.model]
            .create({
            parent: parent.id,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            cropType: `${config.width}x${config.height}`,
            filename: parent.filename,
            image_size: (0, image_size_1.default)(file.fd),
            url: `/${this.path}/${filename}`,
        })
            .fetch();
    }
    async delete(id) {
        await sails.models[this.model].destroy({ where: { id: id } }).fetch();
    }
}
exports.ImageItem = ImageItem;
class TextItem extends ImageItem {
    constructor() {
        super(...arguments);
        this.type = "text";
    }
    async upload(file, filename, origFileName) {
        let parent = await sails.models[this.model]
            .create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            filename: origFileName,
            cropType: "origin",
            image_size: null,
            url: `/${this.path}/${filename}`,
        })
            .fetch();
        await this.createEmptyMeta(parent.id);
        return sails.models[this.model]
            .find({
            where: { id: parent.id },
        })
            .populate("children");
    }
    getChildren() {
        return Promise.resolve([]);
    }
    uploadCropped() {
        return Promise.resolve(undefined);
    }
    createVariants() {
        return Promise.resolve(undefined);
    }
}
exports.TextItem = TextItem;
class ApplicationItem extends TextItem {
    constructor() {
        super(...arguments);
        this.type = "application";
    }
}
exports.ApplicationItem = ApplicationItem;
class VideoItem extends TextItem {
    constructor() {
        super(...arguments);
        this.type = "video";
    }
}
exports.VideoItem = VideoItem;
