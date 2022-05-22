import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineInstance from "../interfaces/waterlineInstance";
import UserAP from "./UserAP";
declare let attributes: {
    id: {
        type: string;
        autoIncrement: boolean;
    };
    name: string;
    description: string;
    users: UserAP[];
};
declare type attributes = typeof attributes & WaterlineInstance;
interface GroupAP extends attributes {
}
export default GroupAP;
declare let model: {
    beforeCreate: (item: any, next: any) => any;
};
declare global {
    const GroupAP: typeof model & WaterlineModel<GroupAP>;
}
