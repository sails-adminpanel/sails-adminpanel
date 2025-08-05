"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fs = require('fs').promises;
let a;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    parent: {
        model: 'MediaManagerAP'
    },
    variants: {
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
    group: {
        type: "string"
    },
    tag: {
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
    },
    modelAssociation: {
        collection: 'MediaManagerAssociationsAP',
        via: 'file'
    }
};
async function deleteFile(file) {
    try {
        await fs.access(file);
        await fs.unlink(file);
        console.log('The file was successfully deleted');
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            console.log('The file does not exist');
        }
        else if (err.code === 'EPERM') {
            console.log('You do not have permission to delete this file');
        }
        else {
            console.error(`An error occurred: ${err}`);
        }
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
        let variants = (await MediaManagerAP.find(criteria).populate('variants'))[0].variants;
        for (const child of variants) {
            await MediaManagerAP.destroy({ id: child.id }).fetch();
        }
        cb();
    },
    async afterDestroy(destroyedRecord, cb) {
        await deleteFile(destroyedRecord.path);
        cb();
    }
};
const model = {
    primaryKey: "id",
    attributes: attributes,
    ...methods,
};
module.exports = model;
