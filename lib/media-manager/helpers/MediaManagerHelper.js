"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFileName = randomFileName;
exports.isImage = isImage;
function randomFileName(filenameOrig, type, prefix) {
    // make random string in end of file
    const prefixLength = 8;
    const randomPrefix = prefix ? Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36) : '';
    return filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}${type}$&`);
}
const extensions = new Set([
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
]);
function isImage(type) {
    return extensions.has(type);
}
