"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bindMediaManager;
const DefaultMediaManager_1 = require("./media-manager/DefaultMediaManager");
const MediaManagerHandler_1 = require("./media-manager/MediaManagerHandler");
function bindMediaManager() {
    sails.after(["hook:orm:loaded"], async () => {
        try {
            let mediaManager = new DefaultMediaManager_1.DefaultMediaManager('default', 'media-manager', `${process.cwd()}/.tmp/public/media-manager/`);
            MediaManagerHandler_1.MediaManagerHandler.add(mediaManager);
        }
        catch (e) {
            console.log('bindMediaManager Error: ', e);
        }
    });
}
