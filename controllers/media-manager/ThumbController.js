"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thumbController = thumbController;
const Thumb_1 = require("../../lib/media-manager/Thumb");
async function thumbController(req, res) {
    const method = req.method.toUpperCase();
    const id = req.query.id;
    const managerId = req.query.managerId;
    if (method === 'GET') {
        res.setHeader('Content-Type', 'image/webp');
        res.send(await Thumb_1.MediaManagerThumb.getThumb(id, managerId));
    }
}
