export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    filter: {
        model: 'FilterAP'
    },
    fieldName: {
        type: "string",
        required: true
    },
    order: {
        type: "number"
    }
}
