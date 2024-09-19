"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = upload;
const adminUtil_1 = require("../lib/adminUtil");
const accessRightsHelper_1 = require("../helper/accessRightsHelper");
function upload(req, res) {
    //console.log('admin > CK-upload');
    let entity = adminUtil_1.AdminUtil.findEntityObject(req);
    if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) {
            res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
            return;
        }
        else if (!accessRightsHelper_1.AccessRightsHelper.enoughPermissions([
            `update-${entity.name}-model`,
            `create-${entity.name}-model`,
            `update-${entity.name}-form`,
            `create-${entity.name}-form`
        ], req.session.UserAP)) {
            res.sendStatus(403);
            return;
        }
    }
    if (req.method.toUpperCase() === 'POST') {
        // set upload directory
        const dirDownload = `uploads/${entity.type}/${entity.name}/ckeditor`;
        const dir = `${process.cwd()}/.tmp/public/${dirDownload}/`;
        // make random string in end of file
        let rand = '';
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++) {
            rand += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        //save file
        const filenameOrig = req.body.name.replace(' ', '_');
        let filename = filenameOrig.replace(/$/, '_prefix');
        req.file('image').upload({
            dirname: dir,
            saveAs: filename
        }, function (err, file) {
            if (err)
                return res.serverError(err);
            return res.send({
                msg: "success",
                url: `/${dirDownload}/${filename}`
            });
        });
    }
}
