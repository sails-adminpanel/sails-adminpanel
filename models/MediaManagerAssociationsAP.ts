import {Attributes, ModelTypeDetection, Model} from "sails-typescript";
import {v4 as uuid} from "uuid";

let a: Attributes;
const attributes = a = {
    id: {
        type: "string",
        allowNull: false,
    },
    mediaManagerId: {
        type: 'string'
    },
    model: {
        type: 'json'
    },
    modelId: {
        type: 'json'
    },
	sortOrder: {
		type: 'number'
	},
    file: {
        model: 'MediaManagerAP'
    }
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;

interface MediaManagerAssociationsAP extends Partial<ModelOptions> {
}

export default MediaManagerAssociationsAP;

const methods = {
    beforeCreate(record: MediaManagerAssociationsAP, cb: (err?: Error | string) => void) {
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
    const MediaManagerAssociationsAP: Model<typeof model>;

    interface Models {
        MediaManagerAssociationsAP: MediaManagerAssociationsAP;
    }
}
