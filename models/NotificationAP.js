export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: "string"
    },
    message: {
        type: "string"
    },
    notificationClass: {
        type: "string",
    },
    channel: {
        type: "string",
    },
    metadata: {
        type: 'json'
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
