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
        const thumb = `${process.cwd()}/.tmp/public/media-manager/thumb/${id}_thumb.webp`;
        if (await fileExists(thumb)) {
            return await fs_1.promises.readFile(thumb);
        }
        else {
            if (!await fileExists(`${process.cwd()}/.tmp/public/media-manager/thumb`))
                await fs_1.promises.mkdir(`${process.cwd()}/.tmp/public/media-manager/thumb`);
            await sharp(path)
                .resize({ width: 150, height: 150 })
                .toFile(thumb);
            return await fs_1.promises.readFile(thumb);
        }
    }
}
exports.MediaManagerThumb = MediaManagerThumb;
