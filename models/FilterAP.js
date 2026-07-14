export default {
    id: {
		type: "string",
		// autoIncrement: true,
		primaryKey: true
    },
    name: {
        type: "string",
        required: true
    },
    description: {
        type: "string"
    },
    modelName: {
        type: "string",
        required: true
    },
    conditions: {
        type: "json"
    },
    sortField: {
        type: "string"
    },
    sortDirection: {
        type: "string"
        // 'ASC' or 'DESC'
    },
    visibility: {
        type: "string"
        // 'private' | 'public' | 'groups' | 'system'
    },
    ownerId: {
        type: "number"
    },
    groupIds: {
        type: "json"
    },
    apiEnabled: {
        type: "boolean"
    },
    apiKey: {
        type: "string"
    },
    icon: {
        type: "string"
    },
    color: {
        type: "string"
    },
    version: {
        type: "number"
    },
    columns: {
        collection: "FilterColumnAP",
        via: "filter"
    },
    createdAt: {
        type: 'datetime',
        autoCreatedAt: true
    },
    updatedAt: {
        type: 'datetime',
        autoUpdatedAt: true
    }
}
