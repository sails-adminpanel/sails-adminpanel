"use strict";
function checkMIMEType(allowedTypes, type) {
    const partsFileType = type.split('/');
    const allowedType = `${partsFileType[0]}/*`;
    if (allowedTypes.includes(allowedType))
        return false;
    return !allowedTypes.includes(type);
}
const allowMIME = ['image/*', 'application/*', 'text/*'];
console.log(checkMIMEType(allowMIME, 'image/webp'));
