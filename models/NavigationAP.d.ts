import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineORM";
import { OptionalAll } from "../interfaces/toolsTS";
declare let attributes: {
    id: {
        type: string;
        allowNull: boolean;
    };
    label: {
        type: string;
        required: boolean;
    };
    tree: {
        readonly type: "json";
        readonly required: true;
    };
};
type attributes = typeof attributes & WaterlineEntity;
interface NavigationAP extends OptionalAll<attributes> {
}
export default NavigationAP;
declare let model: {
    beforeCreate(record: NavigationAP, cb: (err?: Error | string) => void): void;
};
declare global {
    const NavigationAP: typeof model & WaterlineModel<NavigationAP, null>;
}
