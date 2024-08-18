"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
const MediaManagerHelper_1 = require("./helpers/MediaManagerHelper");
const sharp = require("sharp");
const fs = require('fs');
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
        const config = JSON.parse(req.body.config);
        let filename = (0, MediaManagerHelper_1.randomFileName)(req.body.name.replace(' ', '_'), '');
        let origFileName = req.body.name.replace(/\.[^\.]+$/, '');
        //save file
        req.file('file').upload({
            dirname: this.dir,
            saveAs: filename
        }, async (err, file) => {
            if (err)
                return res.serverError(err);
            return res.send({
                msg: "success",
                data: await this.setData(file[0], `/${this.path}/${filename}`, filename, config, origFileName)
            });
        });
    }
    async createEmptyMeta() {
        //create empty meta
        let metaData = {
            author: "",
            description: "",
            title: ""
        };
        return MediaManagerMetaAP.create(metaData).fetch();
    }
    async setData(file, url, filename, config, origFileName) {
        if ((0, MediaManagerHelper_1.isImage)(file.type)) {
            return await this.setImage(file, url, filename, config, origFileName);
        }
        else {
            return await this.saveFile(file, url, filename, origFileName);
        }
    }
    async saveFile(file, url, filename, origFileName) {
        let meta = await this.createEmptyMeta();
        let parent = await MediaManagerAP.create({
            parent: null,
            mimeType: file.type,
            size: file.size,
            filename: origFileName,
            cropType: 'origin',
            meta: meta.id,
            image_size: null,
            url: url
        }).fetch();
        return MediaManagerAP.find({
            where: { id: parent.id }
        }).populate('children');
    }
    async setImage(file, url, filename, config, origFileName) {
        const { parentDB, resFile, resFilename, resMIME } = await this.prepareOrigin(file, url, filename, config, origFileName);
        let parentSize = sizeOf(file.fd);
        if (parentSize.width > 150 && parentSize.height > 150) {
            await this.createSizes({
                id: parentDB.id,
                size: parentSize
            }, resFilename, resFile, resMIME, config, origFileName);
        }
        return MediaManagerAP.find({
            where: { id: parentDB.id }
        }).populate('children');
    }
    async prepareOrigin(file, url, filename, config, origFileName) {
        let parent;
        let meta = await this.createEmptyMeta();
        let resFile = file.fd;
        let resFilename = filename;
        let resMIME = file.type;
        // convert file, only webp & jpg
        if (config.convert && (config.convert === 'webp' || config.convert === 'jpg') && config.convert !== sizeOf(file.fd).type && file.type !== 'image/webp') {
            let convertedFileName = filename.replace(/\.[^\.]+$/, `.${config.convert}`); //change file extension
            let convertFile = await this.convertImage(file.fd, `${this.dir}${convertedFileName}`);
            //create parent file converted
            parent = await MediaManagerAP.create({
                parent: null,
                mimeType: `image/${config.convert}`,
                size: convertFile.size,
                cropType: 'origin',
                meta: meta.id,
                filename: origFileName,
                image_size: sizeOf(`${this.dir}${convertedFileName}`),
                url: `/${this.path}/${convertedFileName}`
            }).fetch();
            // delete origin upload file
            setTimeout(() => {
                try {
                    fs.unlinkSync(file.fd);
                    console.log('File is deleted.');
                }
                catch (err) {
                    console.error(err);
                }
            }, 300);
            resFile = `${this.dir}${convertedFileName}`;
            resFilename = convertedFileName;
            resMIME = `image/${config.convert}`;
        }
        else {
            //create parent file origin
            parent = await MediaManagerAP.create({
                parent: null,
                mimeType: file.type,
                size: file.size,
                cropType: 'origin',
                filename: origFileName,
                meta: meta.id,
                image_size: sizeOf(file.fd),
                url: url
            }).fetch();
        }
        return {
            parentDB: parent,
            resFile: resFile,
            resFilename: resFilename,
            resMIME: resMIME
        };
    }
    async createSizes(parent, filename, file, MIME, config, origFileName) {
        //create thumb
        const thumbName = (0, MediaManagerHelper_1.randomFileName)(filename, '_thumb');
        const thumb = await this.resizeImage(file, `${this.dir}${thumbName}`, 150, 150);
        await MediaManagerAP.create({
            parent: parent.id,
            mimeType: MIME,
            size: thumb.size,
            cropType: 'thumb',
            filename: origFileName,
            image_size: sizeOf(`${this.dir}${thumbName}`),
            url: `/${this.path}/${thumbName}`
        });
        if (config.sizes.length) { // create sizes
            for (const confSize of config.sizes) {
                let sizeName = (0, MediaManagerHelper_1.randomFileName)(filename, `_${Object.keys(confSize)[0]}`);
                let { width, height } = confSize[Object.keys(confSize)[0]];
                if (parent.size.width < width || parent.size.height < height)
                    continue;
                let size = await this.resizeImage(file, `${this.dir}${sizeName}`, width, height);
                await MediaManagerAP.create({
                    parent: parent.id,
                    mimeType: MIME,
                    size: size.size,
                    filename: origFileName,
                    cropType: Object.keys(confSize)[0],
                    image_size: sizeOf(`${this.dir}${sizeName}`),
                    url: `/${this.path}/${sizeName}`
                });
            }
        }
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
