"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const MediaManagerHelper_1 = require("./helpers/MediaManagerHelper");
const sharp = require("sharp");
const sizeOf = require("image-size");
class DefaultMediaManager extends AbstractMediaManager_1.AbstractMediaManager {
    constructor() {
        super(...arguments);
        this.id = 'default';
        this.path = 'media-manager';
        this.dir = `${process.cwd()}/.tmp/public/${this.path}/`;
    }
    async getLibrary(req, res) {
        let data = await MediaManagerAP.find({
            where: { parent: null },
            limit: req.param('count'),
            skip: req.param('skip'),
            sort: 'createdAt DESC'
        }).populate('children');
        let next = (await MediaManagerAP.find({
            where: { parent: null },
            limit: +req.param('count'),
            skip: +req.param('skip') === 0 ? +req.param('count') : +req.param('skip') + +req.param('count'),
            sort: 'createdAt DESC'
        })).length;
        return res.send({
            data: data,
            next: !!next
        });
    }
    async upload(req, res) {
        let filename = (0, MediaManagerHelper_1.randomFileName)(req.body.name.replace(' ', '_'));
        //save file
        req.file('file').upload({
            dirname: this.dir,
            saveAs: filename
        }, async (err, file) => {
            if (err)
                return res.serverError(err);
            return res.send({
                msg: "success",
                data: await this.setData(file[0], `/${this.path}/${filename}`, filename)
            });
        });
    }
    async setData(file, url, filename) {
        //create empty meta
        let metaData = {
            author: "",
            description: "",
            title: ""
        };
        let meta = await MediaManagerMetaAP.create(metaData).fetch();
        //create parent file
        let parent = await MediaManagerAP.create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            thumb: false,
            meta: meta.id,
            image_size: sizeOf(file.fd),
            url: url
        }).fetch();
        //create thumb
        const thumbName = (0, MediaManagerHelper_1.randomFileName)(filename, '_thumb');
        const thumb = await this.resizeImage(file.fd, `${this.dir}${thumbName}`, 150, 150);
        let thumbRecord = await MediaManagerAP.create({
            parent: parent.id,
            mimeType: file.type,
            size: thumb.size,
            thumb: true,
            image_size: sizeOf(`${this.dir}${thumbName}`),
            url: `/${this.path}/${thumbName}`
        }).fetch();
        return MediaManagerAP.find({
            where: { id: parent.id }
        }).populate('children');
    }
    async resizeImage(input, output, width, height) {
        return await sharp(input)
            .resize({ width: width, height: height })
            .toFile(output);
    }
    async setMeta(req, res) {
        const data = req.body.data;
        const id = req.body.metaId;
        try {
            await MediaManagerMetaAP.update({ id: id }, data);
            return res.send({
                msg: "success",
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async getMeta(req, res) {
        const data = req.body;
        const fields = {
            author: "",
            description: "",
            title: ""
        };
        return res.send({
            data: (await MediaManagerMetaAP.find({ where: { id: data.metaId } }))[0],
            fields: fields
        });
    }
}
exports.DefaultMediaManager = DefaultMediaManager;
