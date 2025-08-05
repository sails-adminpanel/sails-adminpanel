import { Attributes, ModelTypeDetection, Model } from "sails-typescript";
import { v4 as uuid } from "uuid";

let a: Attributes;
const attributes = a = {
	id: {
		type: "string",
		allowNull: false,
	},
	key: {
		type: 'string'
	},
	value: {
		type: 'json'
	},
	isPublic: {
		type: 'boolean'
	},
	parent: {
		model: 'MediaManagerAP'
	}
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;

interface MediaManagerMetaAP extends Partial<ModelOptions> {
}

export default MediaManagerMetaAP;

const methods = {
	beforeCreate(record: MediaManagerMetaAP, cb: (err?: Error | string) => void) {
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
	const MediaManagerMetaAP: Model<typeof model>;

	interface Models {
		MediaManagerMetaAP: MediaManagerMetaAP;
	}
}
