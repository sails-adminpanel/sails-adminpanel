import WaterlineModel from "../interfaces/waterlineModel";
import WaterlineEntity from "../interfaces/waterlineEntity";
import UserAP from "./UserAP";
declare let attributes: {
    id: {
        type: string;
        autoIncrement: boolean;
    };
    name: string;
    description: string;
    tokens: string[];
    users: UserAP[];
};
declare type attributes = typeof attributes & WaterlineEntity;
interface GroupAP extends attributes {
}
export default GroupAP;
declare let model: {
    beforeCreate: (item: any, next: any) => any;
};
declare global {
    const GroupAP: typeof model & WaterlineModel<GroupAP>;
}
