export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    modelId: {
        type: "string",
        required: true
    },
    modelName: {
        type: "string",
        required: true
    },
    action: {
        type: "string",
    },
    // here stored raw data foreach history-action better to store as incremental binary data
    data: {
        type: "json",
    },
    diff: {
        type: "json",
    },
    user: {
        model: 'UserAP'
    },
    isCurrent: {
        type: 'boolean',
    },
    createdAt: {
        type: 'datetime',
        autoCreatedAt: true
    },
    updatedAt: {
        type: 'datetime',
        autoUpdatedAt: true
    },
    preview: {
        type: 'boolean'
    }
}
