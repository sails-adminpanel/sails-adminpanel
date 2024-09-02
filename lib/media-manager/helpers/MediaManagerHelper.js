"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFileName = randomFileName;
exports.saveRelationsMediaManager = saveRelationsMediaManager;
exports.getRelationsMediaManager = getRelationsMediaManager;
exports.updateRelationsMediaManager = updateRelationsMediaManager;
exports.deleteRelationsMediaManager = deleteRelationsMediaManager;
const MediaManagerHandler_1 = require("../MediaManagerHandler");
/**
 * Create a random file name with prefix and type. If prefix is true, the file name will be prefixed with a random string.
 * @param filenameOrig
 * @param type
 * @param prefix
 */
function randomFileName(filenameOrig, type, prefix) {
    // make random string in end of file
    const prefixLength = 8;
    const randomPrefix = prefix ? Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36) : '';
    return filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}${type}$&`);
}
/**
 * Save media manager relations to database.
 * @param fields
 * @param reqData
 * @param model
 * @param recordId
 */
async function saveRelationsMediaManager(fields, reqData, model, recordId) {
    for (let prop in reqData) {
        if (fields[prop]?.config?.type === 'mediamanager') {
            let data = reqData[prop];
            let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(data.mediaManagerId);
            await mediaManager.saveRelations(data, model, recordId, prop);
        }
    }
}
async function getRelationsMediaManager(data) {
    let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(data.mediaManagerId);
    return await mediaManager.getRelations(data.list);
}
async function updateRelationsMediaManager(fields, reqData, model, recordId) {
    for (let prop in reqData) {
        if (fields[prop]?.config?.type === 'mediamanager') {
            let data = reqData[prop];
            let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(data.mediaManagerId);
            await mediaManager.updateRelations(data, model, recordId, prop);
        }
    }
}
async function deleteRelationsMediaManager(model, record) {
    let config = sails.config.adminpanel.models[model];
    for (const key of Object.keys(record[0])) {
        let field = config.fields[key];
        if (field && field.type === 'mediamanager') {
            let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(field.options.id ?? 'default');
            await mediaManager.deleteRelations(model, record[0].id);
        }
    }
}
