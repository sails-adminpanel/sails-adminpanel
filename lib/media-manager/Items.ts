import { File, MediaManagerItem, MediaFileType, UploaderFile, imageSizes, SortCriteria } from "./AbstractMediaManager";
import { randomFileName, populateVariants } from "./helpers/MediaManagerHelper";
import sizeOf from "image-size";
import * as sharp from "sharp";
import * as fs from 'fs';
import * as path from 'path';

interface Meta {
    [key: string]: string;
}

export class ImageItem extends File<MediaManagerItem> {
    public type: MediaFileType = "image";

    public model: string = "mediamanagerap";

    public metaModel: string = "mediamanagermetaap";

    public imageSizes: imageSizes = sails.config.adminpanel.mediamanager.imageSizes || {}

    constructor(urlPathPrefix: string, fileStoragePath: string) {
        super(urlPathPrefix, fileStoragePath);
    }

    public async getItems(limit: number, skip: number, sort: SortCriteria, group: string): Promise<{ data: MediaManagerItem[]; next: boolean }> {
        let data: MediaManagerItem[] = await sails.models[this.model]
            .find({
                where: { parent: null, mimeType: { contains: this.type }, group: group },
                limit: limit,
                skip: skip,
                sort: sort,
            })
            .populate("variants", { sort: sort }).populate('meta');

        let next: number = (
            await sails.models[this.model].find({
                where: { parent: null, mimeType: { contains: this.type }, group: group },
                limit: limit,
                skip: skip === 0 ? limit : skip + limit,
                sort: sort,
            })
        ).length;

        for (let elem of data) {
            elem.variants = await populateVariants(elem.variants, this.model)
        }

        return {
            data: data,
            next: !!next,
        };
    }

    public async search(s: string, group: string): Promise<MediaManagerItem[]> {
        let data: MediaManagerItem[] = await sails.models[this.model]
            .find({ where: { filename: { contains: s }, mimeType: { contains: this.type }, parent: null, group: group }, sort: "createdAt DESC", })
            .populate("variants", { sort: "createdAt DESC" });
        for (let elem of data) {
            elem.variants = await populateVariants(elem.variants, this.model)
        }
        return data
    }

    public async upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<MediaManagerItem[]> {
        let parent: MediaManagerItem = await sails.models[this.model]
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
        await this.addFileMeta(file.fd, parent.id)

        // create file variants
        if (Object.keys(this.imageSizes).length) {
            await this.createVariants(file, parent, filename, group);
        }

        const item = (await sails.models[this.model].find({ where: { id: parent.id }, }).populate("variants").populate("meta"))[0] as MediaManagerItem;
        item.variants = await populateVariants(item.variants, this.model)
        return [item]
    }

    public async getVariants(id: string): Promise<MediaManagerItem[]> {
        let items = (await sails.models[this.model].findOne({ where: { id: id }, }).populate("variants", { sort: "createdAt DESC" })).variants
        return (await populateVariants(items, this.model))
    }

    protected async createVariants(file: UploaderFile, parent: MediaManagerItem, filename: string, group: string): Promise<void> {
        for (const sizeKey of Object.keys(this.imageSizes)) {
            let sizeName = randomFileName(filename, sizeKey, false);

            let { width, height } = this.imageSizes[sizeKey];

            if (
                sizeOf(file.fd).width < width ||
                sizeOf(file.fd).height < height
            )
                continue;

            let newFile = await this.resizeImage(
                file.fd,
                `${this.dir}${sizeName}`,
                width,
                height,
            );

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

            await this.addFileMeta(`${this.dir}${sizeName}`, newSize.id)

        }
    }

    public async getOrirgin(id: string): Promise<string> {
        return (await sails.models[this.model].findOne({ where: { id: id }, })).path;
    }

    protected async createMeta(id: string): Promise<void> {
        //create empty meta
        let metaData: Meta = {
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

    protected async addFileMeta(file: string, id: string): Promise<void> {
        await sails.models[this.metaModel].create({
            key: 'imageSizes',
            value: sizeOf(file),
            parent: id,
            isPublic: false
        });
    }

    public async getMeta(id: string,): Promise<{ key: string; value: string }[]> {
        return (await sails.models[this.model].findOne(id).populate("meta", { where: { isPublic: true } })).meta;
    }

    async setMeta(id: string, data: { [p: string]: string },): Promise<void> {
        for (const key of Object.keys(data)) {
            await sails.models[this.metaModel].update(
                { parent: id, key: key },
                { value: data[key] },
            );
        }
    }

    protected async resizeImage(input: string, output: string, width: number, height: number,) {
        // Get the directory from the output path
        const outputDir = path.dirname(output);

        // Check if the directory exists, and create it if it doesn't
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Resize the image and save it to the output path
        return await sharp(input)
            .resize({ width: width, height: height })
            .toFile(output);
    }

    public async uploadVariant(parent: MediaManagerItem, file: UploaderFile, filename: string, group: string, localeId: string): Promise<MediaManagerItem> {
        let { width, height } = sizeOf(file.fd)
        let item: MediaManagerItem = await sails.models[this.model]
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

        await this.addFileMeta(file.fd, item.id)

        const variant = (await sails.models[this.model].find({ where: { id: item.id }, }).populate("meta"))[0] as MediaManagerItem;
        return variant
    }

    async delete(id: string): Promise<void> {
        await sails.models[this.model].destroy({ where: { id: id } }).fetch();
    }
}

/*
 * Text item
 */
export class TextItem extends ImageItem {
    public type: MediaFileType = "text";

    public async upload(file: UploaderFile, filename: string, origFileName: string, group: string): Promise<MediaManagerItem[]> {
        let parent: MediaManagerItem = await sails.models[this.model]
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

        const item = (await sails.models[this.model].find({ where: { id: parent.id }, }).populate("variants").populate("meta"))[0] as MediaManagerItem;
        item.variants = await populateVariants(item.variants, this.model)
        return [item]
    }

    getvariants(): Promise<MediaManagerItem[]> {
        return Promise.resolve([]);
    }

    public async uploadVariant(parent: MediaManagerItem, file: UploaderFile, filename: string, group: string, localeId: string): Promise<MediaManagerItem> {
        let variants = parent.variants.filter(e => /^loc:/.test(e.tag) === false)
        let item: MediaManagerItem = await sails.models[this.model]
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

        const variant = (await sails.models[this.model].find({ where: { id: item.id }, }).populate("meta"))[0] as MediaManagerItem;
        return variant
    }

    public async getVariants(id: string): Promise<MediaManagerItem[]> {
        let items = (await sails.models[this.model].findOne({ where: { id: id }, }).populate("variants", { sort: "createdAt DESC" })).variants
        return (await populateVariants(items, this.model))
    }
}

export class ApplicationItem extends TextItem {
    public type: MediaFileType = "application";
}

export class VideoItem extends TextItem {
    public type: MediaFileType = "video";
}
