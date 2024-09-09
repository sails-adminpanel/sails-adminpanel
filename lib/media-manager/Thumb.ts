import sharp = require("sharp");
import { UploaderFile } from "./AbstractMediaManager";
import { promises as fs } from 'fs';
import { MediaManagerHandler } from "./MediaManagerHandler";

export class MediaManagerThumb {
    public static async getThumb(id: string, managerId: string) {
        const fileExists = async (path: string) => !!(await fs.stat(path).catch(e => false));

        const manager = MediaManagerHandler.get(managerId)
        const path = await manager.getOrigin(id)
        const thumb = `${process.cwd()}/.tmp/public/media-manager/thumb/${id}_thumb.webp`

        if (await fileExists(thumb)) {
            return await fs.readFile(thumb)
        } else {
            if (!await fileExists(`${process.cwd()}/.tmp/public/media-manager/thumb`)) await fs.mkdir(`${process.cwd()}/.tmp/public/media-manager/thumb`);
            await sharp(path)
                .resize({ width: 150, height: 150 })
                .toFile(thumb)
            return await fs.readFile(thumb)
        }

    }
}
