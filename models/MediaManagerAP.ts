import {Attributes, ModelTypeDetection, Model} from "sails-typescript";
import {v4 as uuid} from "uuid";

let a: Attributes;
const attributes = a = {
	id: {
		type: "string",
		allowNull: false,
	},
	parentId: {
		model: 'MediaManagerAP',
	},
	mimeType: {
		type: 'string'
	},
	size: {
		type: 'string'
	},
	date: {
		type: 'string'
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
