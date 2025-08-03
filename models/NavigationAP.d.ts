declare const _default: {
    id: {
        type: string;
        autoIncrement: boolean;
        primaryKey: boolean;
    };
    label: {
        type: string;
        required: boolean;
        unique: boolean;
    };
    tree: {
        type: string;
        required: boolean;
    };
};
export default _default;
export interface NavigationAP {
    id: string;
    label: string;
    tree: Record<string, unknown>;
}
