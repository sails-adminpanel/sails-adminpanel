import { MediaManagerThumb } from "../../lib/media-manager/Thumb";

export async function thumbController(req: ReqTypeAP, res: ResTypeAP) {
    const method = req.method.toUpperCase();
    const id = req.query.id as string
    const managerId = req.query.managerId as string
    if (method === 'GET') {
        res.setHeader('Content-Type', 'image/webp');
        res.send(await MediaManagerThumb.getThumb(id, managerId));
    }

}
