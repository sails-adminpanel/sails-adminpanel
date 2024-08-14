"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMediaManager = void 0;
const AbstractMediaManager_1 = require("./AbstractMediaManager");
class DefaultMediaManager extends AbstractMediaManager_1.AbstractMediaManager {
    constructor() {
        super(...arguments);
        this.id = 'default';
    }
    upload(req, res) {
        const dir = `${process.cwd()}/.tmp/public/media-manager/`;
        // make random string in end of file
        const prefixLength = 8;
        const randomPrefix = Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36);
        //save file
        const filenameOrig = req.body.name.replace(' ', '_');
        let filename = filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}$&`);
        req.file('file').upload({
            dirname: dir,
            saveAs: filename
        }, async (err, file) => {
            if (err)
                return res.serverError(err);
            await this.setData(file);
            // return res.send({
            // 	msg: "success",
            // 	url: `/media-manager/${filename}`
            // })
        });
    }
    async setData(file) {
        console.log(file);
    }
}
exports.DefaultMediaManager = DefaultMediaManager;
