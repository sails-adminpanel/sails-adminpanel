import { Attributes, ModelTypeDetection, Model } from "sails-typescript";

let a: Attributes;
const attributes = a = {
  id: {
    type: "number",
    autoIncrement: true,
  },
  name: {
    type: "string",
    required: true,
    unique: true,
  },
  description: {
    type: "string",
  },
  tokens: {
    type: "json",
  },
  users: {
    collection: "UserAP",
    via: "groups",
  },
}  as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;
interface GroupAP extends Partial<ModelOptions> {}
export default GroupAP;

const methods = {
  beforeCreate(record: GroupAP, cb: (err?: Error | string) => void) {
    cb();
  },
};

const model = {
  primaryKey: "id",
  attributes: attributes,
  ...methods,
};

module.exports = model;

declare global {
  const GroupAP: Model<typeof model>;
  interface Models {
    GroupAP: GroupAP;
  }
  interface AppCustomJsonTypes {
    tokens: string[]
  }
}
