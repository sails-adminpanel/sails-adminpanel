import {Attributes, ModelTypeDetection, Model} from "sails-typescript";
import {v4 as uuid} from "uuid";

const fs = require('fs').promises;

let a: Attributes;
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
	},
	modelAssociation: {
		collection: 'MediaManagerAssociationsAP',
		via: 'file'
	}
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;

interface MediaManagerAP extends Partial<ModelOptions> {
}

export default MediaManagerAP;

async function deleteFile(file: string) {
	try {
		await fs.access(file);
		await fs.unlink(file);
		console.log('The file was successfully deleted');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log('The file does not exist');
		} else if (err.code === 'EPERM') {
			console.log('You do not have permission to delete this file');
		} else {
			console.error(`An error occurred: ${err}`);
		}
	}
}

const methods = {
	beforeCreate(record: MediaManagerAP, cb: (err?: Error | string) => void) {
		if (!record.id) {
			record.id = uuid();
		}
		cb();
	},
	async beforeDestroy(criteria: { where: object }, cb: (err?: Error | string) => void) {
		let parent = (await MediaManagerAP.find(criteria).populate('meta'))[0]
		let meta = parent.meta
		for (const metaElement of meta) {
			await MediaManagerMetaAP.destroy({id: metaElement.id})
		}
		let children = (await MediaManagerAP.find(criteria).populate('children'))[0].children
		for (const child of children) {
			await MediaManagerAP.destroy({id: child.id}).fetch()
		}
		cb();
	},

	async afterDestroy(destroyedRecord: MediaManagerAP, cb: (err?: Error | string) => void) {
		await deleteFile(destroyedRecord.path)
		cb();
	}
};

const model = {
	primaryKey: "id",
	attributes: attributes,
	...methods,
};

module.exports = model;

declare global {
	const MediaManagerAP: Model<typeof model>;

	interface Models {
		MediaManagerAP: MediaManagerAP;
	}
}
