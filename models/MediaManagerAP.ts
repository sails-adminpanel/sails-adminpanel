import {Attributes, ModelTypeDetection, Model} from "sails-typescript";
import {v4 as uuid} from "uuid";

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
		model: 'MediaManagerMetaAP'
	}
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;

interface MediaManagerAP extends Partial<ModelOptions> {
}

export default MediaManagerAP;

const methods = {
	beforeCreate(record: MediaManagerAP, cb: (err?: Error | string) => void) {
		if (!record.id) {
			record.id = uuid();
		}
		cb();
	},

	/** ... Any model methods here ... */
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
