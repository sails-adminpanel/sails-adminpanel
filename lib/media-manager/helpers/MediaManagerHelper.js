"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFileName = randomFileName;
function randomFileName(filenameOrig, type) {
    // make random string in end of file
    const prefixLength = 8;
    const randomPrefix = Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36);
    return filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}${type}$&`);
}
