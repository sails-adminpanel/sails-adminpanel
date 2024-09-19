"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomFileName = randomFileName;
exports.saveRelationsMediaManager = saveRelationsMediaManager;
exports.getRelationsMediaManager = getRelationsMediaManager;
exports.deleteRelationsMediaManager = deleteRelationsMediaManager;
exports.populateVariants = populateVariants;
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
            await mediaManager.setRelations(data, model, recordId, prop);
        }
    }
}
/*
* Get realtions
* @param data
*/
async function getRelationsMediaManager(data) {
    let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(data.mediaManagerId);
    return await mediaManager.getRelations(data.list);
}
/*
* Delate Ralations
* @param model
* @param record
*/
async function deleteRelationsMediaManager(model, record) {
    let config = sails.config.adminpanel.models[model];
    for (const key of Object.keys(record[0])) {
        let field = config.fields[key];
        if (field && field.type === 'mediamanager') {
            const option = field.options;
            let mediaManager = MediaManagerHandler_1.MediaManagerHandler.get(option?.id ?? 'default');
            let emptyData = {
                list: [],
                mediaManagerId: ''
            };
            await mediaManager.setRelations(emptyData, model, record[0].id, key);
        }
    }
}
/**
 * @param items
 */
async function populateVariants(variants, model) {
    let items = [];
    for (let variant of variants) {
        variant = (await sails.models[model].find({ where: { id: variant.id } }).populate("meta"))[0];
        items.push(variant);
    }
    return items;
}
