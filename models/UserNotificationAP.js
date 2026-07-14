export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: "number",
        required: true
    },
    notificationId: {
        model: "NotificationAP"
    },
    read: {
        type: "boolean",
        defaultsTo: false
    }
}
