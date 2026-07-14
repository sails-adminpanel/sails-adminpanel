export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    key: {
        type: "string"
    },
    value: {
        type: "json"
    },
    isPublic: {
        type: "boolean"
    },
    parent: {
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
}
