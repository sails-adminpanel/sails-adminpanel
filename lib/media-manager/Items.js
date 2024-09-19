"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoItem = exports.ApplicationItem = exports.TextItem = exports.ImageItem = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const MediaManagerHelper_1 = require("./helpers/MediaManagerHelper");
const image_size_1 = require("image-size");
const sharp = require("sharp");
class ImageItem extends AbstractMediaManager_1.File {
    constructor(urlPathPrefix, fileStoragePath) {
        super(urlPathPrefix, fileStoragePath);
        this.type = "image";
        this.model = "mediamanagerap";
        this.metaModel = "mediamanagermetaap";
        this.imageSizes = sails.config.adminpanel.mediamanager.imageSizes || {};
    }
    async getItems(limit, skip, sort, group) {
        let data = await sails.models[this.model]
            .find({
            where: { parent: null, mimeType: { contains: this.type }, group: group },
            limit: limit,
            skip: skip,
            sort: sort,
        })
            .populate("variants", { sort: sort }).populate('meta');
        let next = (await sails.models[this.model].find({
            where: { parent: null, mimeType: { contains: this.type }, group: group },
            limit: limit,
            skip: skip === 0 ? limit : skip + limit,
            sort: sort,
        })).length;
        for (let elem of data) {
            elem.variants = await (0, MediaManagerHelper_1.populateVariants)(elem.variants, this.model);
        }
        return {
            data: data,
            next: !!next,
        };
    }
    async search(s, group) {
        let data = await sails.models[this.model]
            .find({ where: { filename: { contains: s }, mimeType: { contains: this.type }, parent: null, group: group }, sort: "createdAt DESC", })
            .populate("variants", { sort: "createdAt DESC" });
        for (let elem of data) {
            elem.variants = await (0, MediaManagerHelper_1.populateVariants)(elem.variants, this.model);
        }
        return data;
    }
    async upload(file, filename, origFileName, group) {
        let parent = await sails.models[this.model]
            .create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            group: group,
            tag: "origin",
            filename: origFileName,
            url: `/${this.path}/${filename}`,
        })
            .fetch();
        await this.createMeta(parent.id);
        await this.addFileMeta(file.fd, parent.id);
        // create file variants
        if (Object.keys(this.imageSizes).length) {
            await this.createVariants(file, parent, filename, group);
        }
        const item = (await sails.models[this.model].find({ where: { id: parent.id }, }).populate("variants").populate("meta"))[0];
        item.variants = await (0, MediaManagerHelper_1.populateVariants)(item.variants, this.model);
        return [item];
    }
    async getVariants(id) {
        let items = (await sails.models[this.model].findOne({ where: { id: id }, }).populate("variants", { sort: "createdAt DESC" })).variants;
        return (await (0, MediaManagerHelper_1.populateVariants)(items, this.model));
    }
    async createVariants(file, parent, filename, group) {
        for (const sizeKey of Object.keys(this.imageSizes)) {
            let sizeName = (0, MediaManagerHelper_1.randomFileName)(filename, sizeKey, false);
            let { width, height } = this.imageSizes[sizeKey];
            if ((0, image_size_1.default)(file.fd).width < width ||
                (0, image_size_1.default)(file.fd).height < height)
                continue;
            let newFile = await this.resizeImage(file.fd, `${this.dir}${sizeName}`, width, height);
            let newSize = await sails.models[this.model].create({
                parent: parent.id,
                mimeType: parent.mimeType,
                size: newFile.size,
                filename: parent.filename,
                group: group,
                path: `${this.dir}${sizeName}`,
                tag: `saze:${sizeKey}`,
                url: `/${this.path}/${sizeName}`,
            }).fetch();
            await this.addFileMeta(`${this.dir}${sizeName}`, newSize.id);
        }
    }
    async getOrirgin(id) {
        return (await sails.models[this.model].findOne({ where: { id: id }, })).path;
    }
    async createMeta(id) {
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
                isPublic: true
            });
        }
    }
    async addFileMeta(file, id) {
        await sails.models[this.metaModel].create({
            key: 'imageSizes',
            value: (0, image_size_1.default)(file),
            parent: id,
            isPublic: false
        });
    }
    async getMeta(id) {
        return (await sails.models[this.model].findOne(id).populate("meta", { where: { isPublic: true } })).meta;
    }
    async setMeta(id, data) {
        for (const key of Object.keys(data)) {
            await sails.models[this.metaModel].update({ parent: id, key: key }, { value: data[key] });
        }
    }
    async resizeImage(input, output, width, height) {
        return await sharp(input)
            .resize({ width: width, height: height })
            .toFile(output);
    }
    async uploadVariant(parent, file, filename, group, localeId) {
        let { width, height } = (0, image_size_1.default)(file.fd);
        let item = await sails.models[this.model]
            .create({
            parent: parent.id,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            group: group,
            tag: localeId ? `loc:${localeId}` : `size:${width}x${height}`,
            filename: parent.filename,
            url: `/${this.path}/${filename}`,
        }).fetch();
        await this.addFileMeta(file.fd, item.id);
        const variant = (await sails.models[this.model].find({ where: { id: item.id }, }).populate("meta"))[0];
        return variant;
    }
    async delete(id) {
        await sails.models[this.model].destroy({ where: { id: id } }).fetch();
    }
}
exports.ImageItem = ImageItem;
/*
 * Text item
 */
class TextItem extends ImageItem {
    constructor() {
        super(...arguments);
        this.type = "text";
    }
    async upload(file, filename, origFileName, group) {
        let parent = await sails.models[this.model]
            .create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            group: group,
            filename: origFileName,
            tag: "origin",
            url: `/${this.path}/${filename}`,
        })
            .fetch();
        await this.createMeta(parent.id);
        const item = (await sails.models[this.model].find({ where: { id: parent.id }, }).populate("variants").populate("meta"))[0];
        item.variants = await (0, MediaManagerHelper_1.populateVariants)(item.variants, this.model);
        return [item];
    }
    getvariants() {
        return Promise.resolve([]);
    }
    async uploadVariant(parent, file, filename, group, localeId) {
        let variants = parent.variants.filter(e => /^loc:/.test(e.tag) === false);
        let item = await sails.models[this.model]
            .create({
            parent: parent.id,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            group: group,
            tag: localeId ? `loc:${localeId}` : `ver: ${variants.length + 1}`,
            filename: parent.filename,
            url: `/${this.path}/${filename}`,
        }).fetch();
        const variant = (await sails.models[this.model].find({ where: { id: item.id }, }).populate("meta"))[0];
        return variant;
    }
    async getVariants(id) {
        let items = (await sails.models[this.model].findOne({ where: { id: id }, }).populate("variants", { sort: "createdAt DESC" })).variants;
        return (await (0, MediaManagerHelper_1.populateVariants)(items, this.model));
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
