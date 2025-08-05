import { Attributes, ModelTypeDetection, Model } from "sails-typescript";
import { v4 as uuid } from "uuid";

let a: Attributes;
const attributes = a = {
  id: {
    type: "string",
    allowNull: false,
  },
  label: {
    type: "string",
    required: true,
  },
  tree: {
    type: "json",
    required: true,
  },
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;
interface NavigationAP extends Partial<ModelOptions> {}
export default NavigationAP;

const methods = {
  beforeCreate(record: NavigationAP, cb: (err?: Error | string) => void) {
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
  const NavigationAP: Model<typeof model>;
  interface Models {
    NavigationAP: NavigationAP;
  }
}
