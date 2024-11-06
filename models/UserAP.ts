import { ModelTypeDetection, Model } from "sails-typescript";
import { generate }  from 'password-hash';
import { WidgetConfig } from "../lib/widgets/widgetHandler";

const attributes= {
  id: {
    type: 'number',
    autoIncrement: true,
  },
  login: {
    type: 'string',
    required: true,
    unique: true,
  },
  fullName: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
  },
  passwordHashed: {
    type: 'string',
  },
  password: {
    type: 'string',
  },
  timezone: {
    type: 'string',
  },
  expires: {
    type: 'string',
  },
  locale: {
    type: 'string',
  },
  isDeleted: {
    type: 'boolean',
  },
  isActive: {
    type: 'boolean',
  },
  isAdministrator: {
    type: 'boolean',
  },
  groups: {
    collection: 'GroupAP',
    via: 'users',
  },
  widgets: {
    type: 'json',
  },
} as const;

type ModelOptions = ModelTypeDetection<typeof attributes>;
export interface UserAPRecord extends Partial<ModelOptions> {}

// Методы модели
const methods = {
  beforeCreate(values: UserAPRecord, cb: (err?: Error | string) => void) {
    values.passwordHashed = generate(values.login + values.password);
    values.password = 'masked';
    cb();
  },

  beforeUpdate(values: UserAPRecord, cb: (err?: Error | string) => void) {
    if (values.password) {
      values.passwordHashed = generate(values.login + values.password);
      values.password = 'masked';
    }
    cb();
  },

  /** ... Any additional model methods ... */
};

// Модель
const model = {
  primaryKey: "id",
  attributes: attributes,
  ...methods,
};

module.exports = model;

declare global {
  const UserAP: Model<typeof model>;
  interface Models {
    UserAP: UserAPRecord;
  }
  interface AppCustomJsonTypes {
    widgets: WidgetConfig[]
  }
}
