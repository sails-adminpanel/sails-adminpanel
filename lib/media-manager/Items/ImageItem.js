"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageItem = void 0;
const AbstractMediaManager_1 = require("../AbstractMediaManager");
const MediaManagerHelper_1 = require("../helpers/MediaManagerHelper");
const image_size_1 = require("image-size");
class ImageItem extends AbstractMediaManager_1.File {
    constructor(path, dir, model, metaModel) {
        super(path, dir, model, metaModel);
        this.type = "image";
    }
    async upload(file, filename, origFileName, imageSizes) {
        let parent = await sails.models[this.model].create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            path: file.fd,
            cropType: 'origin',
            filename: origFileName,
            image_size: (0, image_size_1.default)(file.fd),
            url: `/${this.path}/${filename}`
        }).fetch();
        await this.createEmptyMeta(parent.id);
        await this.createThumb(parent.id, file, filename, origFileName);
        return sails.models[this.model].find({
            where: { id: parent.id }
        }).populate('children');
    }
    async createThumb(parentId, file, filename, origFileName) {
        const thumbName = (0, MediaManagerHelper_1.randomFileName)(filename, '_thumb');
        const thumb = await this.resizeImage(file.fd, `${this.dir}${thumbName}`, 150, 150);
        await sails.models[this.model].create({
            parent: parentId,
            mimeType: file.type,
            size: thumb.size,
            cropType: 'thumb',
            path: `${this.dir}${thumbName}`,
            filename: origFileName,
            image_size: (0, image_size_1.default)(`${this.dir}${thumbName}`),
            url: `/${this.path}/${thumbName}`
        });
    }
    async createEmptyMeta(id) {
        //create empty meta
        let metaData = {
            author: "",
            description: "",
            title: ""
        };
        for (const key of Object.keys(metaData)) {
            await sails.models[this.metaModel].create({
                key: key,
                value: metaData[key],
                parent: id
            });
        }
    }
    async getMeta(id) {
        return (await sails.models[this.model].findOne(id).populate('meta')).meta;
    }
    async setMeta(id, data) {
        for (const key of Object.keys(data)) {
            await sails.models[this.metaModel].update({ parent: id, key: key }, { value: data[key] });
        }
        return { msg: "success" };
    }
}
exports.ImageItem = ImageItem;
