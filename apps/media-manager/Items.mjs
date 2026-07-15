import {
    File,
	populateVariants
} from "adminizer";
import sizeOf from "image-size";
import sharp from "sharp";
import * as fs from "fs";
import path from "path";
import {mediaManagerModelNames} from  "./DefaultMediaManager.mjs"

export class ImageItem extends File {
    type = "image";

    constructor(
        runtime,
        urlPathPrefix,
        fileStoragePath,
        imageSizes = {}
    ) {
        super(urlPathPrefix, fileStoragePath);
    }

     media() {
        return this.runtime.models.get(mediaManagerModelNames.media);
    }

     meta() {
        return this.runtime.models.get(mediaManagerModelNames.meta);
    }

     associations() {
        return this.runtime.models.get(
            mediaManagerModelNames.associations
        );
    }

    async getItems(limit, skip, sort, group) {
        const where = {
            parent: null,
            mimeType: {contains: this.type},
            group,
        };
        const data = await this.media().find({
            where,
            limit,
            skip,
            sort,
            populate: {variants: {sort}, meta: true},
        });
        for (const item of data) {
            item.variants = await populateVariants(
                this.runtime,
                item.variants ?? [],
                mediaManagerModelNames.media
            );
        }
        const next = await this.media().find({where, limit, skip: skip + limit, sort});
        return {data, next: next.length > 0};
    }

    async search(search, group) {
        const data = await this.media().find({
            where: {
                filename: {contains: search},
                mimeType: {contains: this.type},
                parent: null,
                group,
            },
            sort: "createdAt DESC",
            populate: {variants: {sort: "createdAt DESC"}, meta: true},
        });
        for (const item of data) {
            item.variants = await populateVariants(
                this.runtime,
                item.variants ?? [],
                mediaManagerModelNames.media
            );
        }
        return data;
    }

    async upload(
        file,
        filename,
        originalName,
        group
    ) {
        const parent = await this.media().create({
            parent: null,
            mimeType: file.mimetype,
            size: file.size,
            path: this.storagePath(filename),
            group,
            tag: "origin",
            filename: originalName,
            url: this.publicUrl(filename),
        });
        await this.createMeta(parent.id);
        await this.addImageSizeMeta(file.path, parent.id);
        if (Object.keys(this.imageSizes).length && file.mimetype !== "image/svg+xml") {
            await this.createVariants(file, parent, filename, group);
        }
        return [await this.getFile(parent.id)];
    }

    async getVariants(id) {
        const item = await this.media().findOne({
            where: {id},
            populate: {variants: {sort: "createdAt DESC"}},
        });
        return populateVariants(
            this.runtime,
            item?.variants ?? [],
            mediaManagerModelNames.media
        );
    }

    async getOrigin(id) {
        return (await this.media().findOne({where: {id}})).path;
    }

    async getFile(id) {
        const item = await this.media().findOne({
            where: {id: String(id)},
            populate: {variants: {sort: "createdAt DESC"}, meta: true},
        });
        if (item) {
            item.variants = await populateVariants(
                this.runtime,
                item.variants ?? [],
                mediaManagerModelNames.media
            );
        }
        return item;
    }

    async getMeta(id){
        const item = await this.media().findOne({
            where: {id},
            populate: {meta: {where: {isPublic: true}}},
        });
        return (item?.meta ?? []).flatMap((meta) =>
            typeof meta.key === "string" && typeof meta.value === "string"
                ? [{key: meta.key, value: meta.value}]
                : []
        );
    }

    async setMeta(id, data) {
        for (const [key, value] of Object.entries(data)) {
            await this.meta().update({where: {parentId: id, key}}, {value});
        }
    }

    async uploadVariant(
        parent,
        file,
        filename,
        group,
        localeId
    ) {
        const dimensions = sizeOf(fs.readFileSync(file.path));
        const item = await this.media().create({
            parent: parent.id,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            group,
            tag: localeId ? `loc:${localeId}` : `size:${dimensions.width}x${dimensions.height}`,
            filename: parent.filename,
            url: this.publicUrl(filename),
        });
        await this.addImageSizeMeta(file.path, item.id);
        return this.media().findOne({where: {id: item.id}});
    }

    async delete(id) {
        if ((await this.associations().find({where: {fileId: id}})).length) {
            return false;
        }

        const criteria = {where: {id}};
        const record = await this.media().findOne({
            ...criteria,
            populate: {variants: true, meta: true},
        });
        if (!record) {
            return true;
        }

        for (const meta of record.meta ?? []) {
            await this.meta().destroy({where: {id: meta.id}});
        }
        for (const variant of record.variants ?? []) {
            await this.media().destroy({where: {id: variant.id}});
            await deleteFile(variant.path);
        }
        await this.media().destroy(criteria);
        await deleteFile(record.path);
        return true;
    }

    async createMeta(id) {
        for (const key of ["author", "description", "title"]) {
            await this.meta().create({key, value: "", parent: id, isPublic: true});
        }
    }

    async addImageSizeMeta(filePath, id) {
        await this.meta().create({
            key: "imageSizes",
            value: sizeOf(fs.readFileSync(filePath)),
            parent: id,
            isPublic: false,
        });
    }

     async createVariants(
        file,
        parent,
        filename,
        group
    ) {
        const dimensions = sizeOf(fs.readFileSync(file.path));
        for (const [sizeName, target] of Object.entries(this.imageSizes)) {
            if (dimensions.width < target.width || dimensions.height < target.height) {
                continue;
            }

            const variantName = addFileSuffix(filename, sizeName);
            const output = this.storagePath(variantName);
            await fs.promises.mkdir(path.dirname(output), {recursive: true});
            const resized = await sharp(file.path)
                .resize({width: target.width, height: target.height})
                .toFile(output);
            const variant = await this.media().create({
                parent: parent.id,
                mimeType: parent.mimeType,
                size: resized.size,
                filename: parent.filename,
                group,
                path: output,
                tag: `size:${sizeName}`,
                url: this.publicUrl(variantName),
            });
            await this.addImageSizeMeta(output, variant.id);
        }
    }

     storagePath(filename) {
        return path.join(this.fileStoragePath, this.urlPathPrefix, filename);
    }

     publicUrl(filename) {
        return `/${this.urlPathPrefix}/${filename}`;
    }
}

export class TextItem extends ImageItem {
    type = "text";

    async upload(
        file,
        filename,
        originalName,
        group
    ) {
        const item = await this.media().create({
            parent: null,
            mimeType: file.mimetype,
            size: file.size,
            path: this.storagePath(filename),
            group,
            filename: originalName,
            tag: "origin",
            url: this.publicUrl(filename),
        });
        await this.createMeta(item.id);
        return [await this.getFile(item.id)];
    }

    async uploadVariant(
        parent,
        file,
        filename,
        group,
        localeId
    ) {
        const variants = (parent.variants ?? []).filter((item) => !/^loc:/.test(item.tag));
        const item = await this.media().create({
            parent: parent.id,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            group,
            tag: localeId ? `loc:${localeId}` : `ver:${variants.length + 1}`,
            filename: parent.filename,
            url: this.publicUrl(filename),
        });
        return this.media().findOne({where: {id: item.id}});
    }
}

export class ApplicationItem extends TextItem {
     type = "application";
}

export class VideoItem extends TextItem {
     type = "video";
}

function addFileSuffix(filename, suffix) {
    return filename.replace(/\.[^.]+$/, `_${suffix}$&`);
}

async function deleteFile(filePath) {
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}
