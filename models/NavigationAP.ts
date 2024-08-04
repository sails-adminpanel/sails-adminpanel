import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineORM";
import {OptionalAll} from "../interfaces/toolsTS";
import {v4 as uuid} from "uuid";

let attributes = {
	id: {
		type: "string",
		allowNull: false,
	},
	label: {
		type: 'string',
		required: true
	},
	tree: {
		type: 'json',
		required: true
	} as const
};

type attributes = typeof attributes & WaterlineEntity;
interface NavigationAP extends OptionalAll<attributes> {}
export default NavigationAP;

let model = {
	beforeCreate(record: NavigationAP, cb: (err?: Error | string) => void) {
		if (!record.id) {
			record.id = uuid();
		}

		cb();
	},

	/** ... Any model methods here ... */

};

module.exports = {
	primaryKey: "id",
	attributes: attributes,
	...model,
};

declare global {
	const NavigationAP: typeof model & WaterlineModel<NavigationAP, null>;
}

