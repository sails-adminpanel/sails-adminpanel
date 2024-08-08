import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineORM";
import UserAP from "./UserAP";
import { OptionalAll } from "../interfaces/toolsTS";
declare let attributes: {
    id: number;
    name: string;
    description: string;
    tokens: string[];
    users: UserAP[];
};
type attributes = typeof attributes & WaterlineEntity;
interface GroupAP extends OptionalAll<attributes> {
}
export default GroupAP;
declare let model: {
    beforeCreate: (item: GroupAP, next: Function) => any;
};
declare global {
    const GroupAP: typeof model & WaterlineModel<GroupAP, null>;
}
