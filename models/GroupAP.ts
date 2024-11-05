import { ModelTypeDetection, Model } from "sails-typescript";

const attributes = {
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
export interface GroupAPRecord extends Partial<ModelOptions> {}

const methods = {
  beforeCreate(record: GroupAPRecord, cb: (err?: Error | string) => void) {
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
    GroupAP: GroupAPRecord;
  }
  interface AppCustomJsonTypes {
    tokens: string[]
  }
}
