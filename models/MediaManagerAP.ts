import {Attributes, ModelTypeDetection, Model} from "sails-typescript";
import {v4 as uuid} from "uuid";
import {WhereCriteriaQuery} from "sails-typescript/criteria";
import MediaManagerMetaAP from "./MediaManagerMetaAP";
import * as fs from "node:fs";

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
	}
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;

interface MediaManagerAP extends Partial<ModelOptions> {
}

export default MediaManagerAP;

function deleteFile(file:string) {
	if (fs.existsSync(file)) {
		fs.unlinkSync(file);
	} else {
		console.log('File not found : '+ file);
	}
}

const methods = {
	beforeCreate(record: MediaManagerAP, cb: (err?: Error | string) => void) {
		if (!record.id) {
			record.id = uuid();
		}
		cb();
	},
	async beforeDestroy(criteria: {where: object}, cb: (err?: Error | string) => void) {
		let parent = (await MediaManagerAP.find(criteria).populate('meta'))[0]
		let meta = parent.meta
		for (const metaElement of meta) {
			await MediaManagerMetaAP.destroy({id: metaElement.id})
		}
		let children = (await MediaManagerAP.find(criteria).populate('children'))[0].children
		for (const child of children) {
			await MediaManagerAP.destroy({id: child.id})
		}
		deleteFile(parent.path)
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
