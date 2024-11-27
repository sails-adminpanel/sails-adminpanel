"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaManagerThumb = void 0;
const sharp = require("sharp");
const fs_1 = require("fs");
const MediaManagerHandler_1 = require("./MediaManagerHandler");
class MediaManagerThumb {
    static async getThumb(id, managerId) {
        const fileExists = async (path) => !!(await fs_1.promises.stat(path).catch(e => false));
        const manager = MediaManagerHandler_1.MediaManagerHandler.get(managerId);
        const path = await manager.getOrigin(id);
        const baseThumbPath = `${process.cwd()}/.tmp/thumbs`;
        if (!await fileExists(baseThumbPath))
            await fs_1.promises.mkdir(baseThumbPath);
        const thumb = `${baseThumbPath}/${id}_thumb.webp`;
        if (await fileExists(thumb)) {
            return await fs_1.promises.readFile(thumb);
        }
        else {
            await sharp(path)
                .resize({ width: 150, height: 150 })
                .toFile(thumb);
            return await fs_1.promises.readFile(thumb);
        }
    }
}
exports.MediaManagerThumb = MediaManagerThumb;
