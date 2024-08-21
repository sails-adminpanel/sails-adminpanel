"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fs = require("node:fs");
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    parent: {
        model: 'MediaManagerAP'
    },
    children: {
        collection: 'MediaManagerAP',
        via: 'parent'
    },
    mimeType: {
        type: 'string'
    },
    path: {
        type: 'string'
    },
    size: {
        type: 'number'
    },
    image_size: {
        type: "json"
    },
    cropType: {
        type: 'string'
    },
    url: {
        type: 'string'
    },
    filename: {
        type: 'string'
    },
    meta: {
        collection: 'MediaManagerMetaAP',
        via: 'parent'
    }
};
function deleteFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    else {
        console.log('File not found : ' + file);
    }
}
const methods = {
    beforeCreate(record, cb) {
        if (!record.id) {
            record.id = (0, uuid_1.v4)();
        }
        cb();
    },
    async beforeDestroy(criteria, cb) {
        let parent = (await MediaManagerAP.find(criteria).populate('meta'))[0];
        let meta = parent.meta;
        for (const metaElement of meta) {
            await MediaManagerMetaAP.destroy({ id: metaElement.id });
        }
        let children = (await MediaManagerAP.find(criteria).populate('children'))[0].children;
        for (const child of children) {
            await MediaManagerAP.destroy({ id: child.id });
        }
        deleteFile(parent.path);
        cb();
    }
};
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
