"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
const path = require("path");
const Jimp = require('jimp');
// !TODO for images resizing need usage parameters to get request cat.jpg?150. It makes image inscribed in square 150*150px
function upload(req, res) {
    // console.log('admin > upload');
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.havePermission(`update-${entity.name}-model`, req.session.UserAP) &&
            !accessRightsHelper_1.AccessRightsHelper.havePermission(`create-${entity.name}-model`, req.session.UserAP)) {
            return res.sendStatus(403);
        }
    }
    if (req.method.toUpperCase() === 'POST') {
        // if this file must not be loaded
        if (req.body.stop === true) {
            return res.badRequest();
        }
        // sails.log.info(req.body);
        // read field
        if (!req.body.field) {
            return res.serverError('No field name in request');
        }
        // set upload directory
        const dirDownload = '/uploads/' + entity.name + '/' + req.body.field + '/';
        const dir = '/.tmp/public' + dirDownload;
        const assetsDir = process.cwd() + '/assets' + dirDownload;
        const fullDir = process.cwd() + dir;
        // small and large sizes
        let small, large;
        try {
            small = parseInt(req.body.small) || 150;
            large = parseInt(req.body.large) || 900;
        }
        catch (e) {
            return res.badRequest('Invalid request');
        }
        // resizes
        if (!req.body.resize) {
            return res.serverError('No resizes in request');
        }
        let resize;
        try {
            resize = JSON.parse(req.body.resize);
        }
        catch (e) {
            resize = [];
        }
        // if has no file name send error
        if (!req.body.filename) {
            return res.serverError('No file name in request');
        }
        // if request has noo file type send error
        if (!req.body.type) {
            return res.serverError('No type of file');
        }
        const type = req.body.type;
        let aspect;
        try {
            aspect = JSON.parse(req.body.aspect);
        }
        catch (e) {
            aspect = '';
        }
        let size1;
        try {
            size1 = JSON.parse(req.body.size);
            if (size1) {
                if (!size1.width)
                    size1.width = '>=0';
                if (!size1.height)
                    size1.height = '>=0';
            }
        }
        catch (e) {
            size1 = '';
        }
        // make random string in end of file
        let rand = '';
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++) {
            rand += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        //save file
        const filenameOrig = req.body.filename.replace(' ', '_');
        const filename = filenameOrig.substr(0, filenameOrig.lastIndexOf('.')) + rand + '.' + filenameOrig.split('.').reverse()[0];
        const nameSmall = filename.substr(0, filename.lastIndexOf('.')) + '_tumblrDEFAULT.' + filename.split('.').reverse()[0];
        const nameLarge = filename.substr(0, filename.lastIndexOf('.')) + '_largeDEFAULT.' + filename.split('.').reverse()[0];
        req.file('file').upload({
            dirname: fullDir,
            saveAs: filename
        }, function (err, file) {
            if (err)
                return res.serverError(err);
            // images
            if (type === 'images' || type === 'image') {
                Jimp.read('.' + dir + filename, async function (err, image) {
                    if (err)
                        return res.serverError(err);
                    image.write(assetsDir + filename, function (err, img) {
                        if (err)
                            sails.log.error("Can't save image in assets!");
                    });
                    const width = image.bitmap.width;
                    const height = image.bitmap.height;
                    const size = image.bitmap.data.length;
                    // check image parameters
                    const valid = checkValid(width, height, aspect, size1);
                    if (valid === 'size') {
                        return res.badRequest(invalidSize(width, height));
                    }
                    else if (valid === 'aspect') {
                        return res.badRequest('Неправильное соотношение сторон');
                    }
                    let resizes = {};
                    for await (let i of resize) {
                        i.w = parseInt(i.w);
                        i.h = parseInt(i.h);
                        if (!i.quality) {
                            i.quality = 60;
                        }
                        let name = await jimpResize(i);
                        resizes[i.name] = dirDownload + path.basename(name);
                    }
                    async function jimpResize(i) {
                        return new Promise((resolve, reject) => {
                            const name = fullDir + filename.substr(0, filename.lastIndexOf('.')) + '_' + i.name + '.' + filename.split('.').reverse()[0];
                            const name2 = assetsDir + filename.substr(0, filename.lastIndexOf('.')) + '_' + i.name + '.' + filename.split('.').reverse()[0];
                            Jimp.read('.' + dir + filename, function (err, imageTemp) {
                                imageTemp.resize(i.w === -1 ? Jimp.AUTO : i.w, i.h === -1 ? Jimp.AUTO : i.h).quality(i.quality).write(name, function (err, image) {
                                    image.write(name2);
                                    if (err)
                                        return reject(err);
                                    return resolve(name2);
                                });
                            });
                        });
                    }
                    Jimp.read('.' + dir + filename, function (err, image1) {
                        if (err)
                            return res.serverError(err);
                        image1.scaleToFit(large, large).write(fullDir + nameLarge, function () {
                            image1.write(assetsDir + nameLarge);
                            image1.scaleToFit(small, small).write(fullDir + nameSmall, function () {
                                image1.write(assetsDir + nameSmall);
                                // return urls
                                const url = dirDownload + filename;
                                const urlSmall = dirDownload + nameSmall;
                                const urlLarge = dirDownload + nameLarge;
                                let result = {
                                    name: filenameOrig,
                                    url: url,
                                    urlSmall: urlSmall,
                                    urlLarge: urlLarge,
                                    width: width,
                                    height: height,
                                    size: size,
                                    sizes: resizes
                                };
                                res.status(201);
                                res.send(result);
                            });
                        });
                    });
                });
            }
            else if (type === 'files' || type === 'file') {
                const ext = filename.substr(filename.lastIndexOf('.') + 1, filename.length);
                const urlIcon = '/admin/assets/fileuploader/icons/' + ext + '.svg';
                const url = dirDownload + filename;
                res.status(201);
                res.send({
                    name: filenameOrig,
                    url: url,
                    urlSmall: urlIcon,
                    urlLarge: urlIcon,
                    size: file[0].size
                });
            }
        });
    }
}
exports.default = upload;
;
function checkValid(w, h, aspect, size) {
    // aspect
    if (aspect) {
        if (Math.abs(w * aspect.width - h * aspect.height) !== 0) {
            return 'aspect';
        }
    }
    // image size
    let res = 'ok';
    if (size) {
        const a = [size.width, size.height];
        const b = [w, h];
        for (let i = 0; i < a.length; i++) {
            if (!Array.isArray(a[i])) {
                if (/[><=]/.test(a[i]))
                    a[i] = [a[i]];
                else if (a[i] !== b[i])
                    res = 'size';
            }
            for (let j = 0; j < a[i].length; j++) {
                let item = a[i][j];
                let equal = false;
                if (item.indexOf('=') >= 0)
                    equal = true;
                if (item.indexOf('>') >= 0) {
                    if (equal) {
                        if (b[i] < parseInt(item.replace(/\D+/, '')))
                            res = 'size';
                    }
                    else {
                        if (b[i] <= parseInt(item.replace(/\D+/, '')))
                            res = 'size';
                    }
                }
                if (item.indexOf('<') >= 0) {
                    if (equal) {
                        if (b[i] > parseInt(item.replace(/\D+/, '')))
                            res = 'size';
                    }
                    else {
                        if (b[i] >= parseInt(item.replace(/\D+/, '')))
                            res = 'size';
                    }
                }
            }
        }
    }
    return res;
}
function invalidSize(width, height) {
    return 'Картинка не подходит по разрешению\nШирина: ' + width + ', высота: ' + height;
}
