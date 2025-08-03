export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: "string",
        required: true,
        unique: true
    },
    tree: {
        type: "json",
        required: true
    }
}

export interface NavigationAP {
    id: string;
    label: string;
    tree: Record<string, unknown>;
}
