export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    mediaManagerId: {
        type: "string"
    },
    model: {
        type: "string"
    },
    modelId: {
        type: "string" // ✅ Changed: support for strings and numbers via casting to string
    },
    widgetName: {
        type: "string"
    },
    sortOrder: {
        type: "number"
    },
    file: {
        model: "MediaManagerAP"
    },
    createdAt: {
        type: 'datetime',
        autoCreatedAt: true
    },
    updatedAt: {
        type: 'datetime',
        autoUpdatedAt: true
    }
};
