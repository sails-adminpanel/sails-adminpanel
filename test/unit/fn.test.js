"use strict";
function getConvertExtensions(s) {
    const obj = {
        "image/jpeg": "jpg",
        "image/webp": "webp"
    };
    return obj[s];
}
console.log(getConvertExtensions('image/webp'));
