import sharp = require("sharp");
import { promises as fs } from 'fs';
import { MediaManagerHandler } from "./MediaManagerHandler";

export class MediaManagerThumb {
    public static async getThumb(id: string, managerId: string) {
        const fileExists = async (path: string) => !!(await fs.stat(path).catch(e => false));
        
        const manager = MediaManagerHandler.get(managerId)
        const path = await manager.getOrigin(id)
console.log(path,1111222)
        const baseThumbPath = `${process.cwd()}/.tmp/thumbs`
        if (!await fileExists(baseThumbPath)) await fs.mkdir(baseThumbPath);
        
        const thumb = `${baseThumbPath}/${id}_thumb.webp`
        if (await fileExists(thumb)) {
            return await fs.readFile(thumb)
        } else {
            await sharp(path)
                .resize({ width: 150, height: 150 })
                .toFile(thumb)
            return await fs.readFile(thumb)
        }

    }
}
