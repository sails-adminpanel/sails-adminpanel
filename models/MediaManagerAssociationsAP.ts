import { MediaManagerAP } from "./MediaManagerAP";

export default {
  id: {
    type: "string",
    allowNull: false,
    uuid: true,
    primaryKey: true,
    required: true
  },
  mediaManagerId: {
    type: "string"
  },
  model: {
    type: "json"
  },
  modelId: {
    type: "json"
  },
  widgetName: {
    type: "string"
  },
  sortOrder: {
    type: "number"
  },
  file: {
    model: "MediaManagerAP"
  }
}

export interface MediaManagerAssociationsAP {
  id: string;
  mediaManagerId?: string;
  model?: Record<string, unknown>;
  modelId?: Record<string, unknown>;
  widgetName?: string;
  sortOrder?: number;
  file?: MediaManagerAP;
}
