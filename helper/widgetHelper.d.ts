import { NavigationOptionsField } from "../interfaces/adminpanelConfig";
export declare class WidgetHelper {
    static editNavigationConfigNormalize(_config: NavigationOptionsField): Promise<{
        maxNestedItems?: number;
        displacementControl?: boolean;
        disableAddingProperty?: boolean;
        disableDeletingProperty?: boolean;
        propertyList?: {
            [key: string]: {
                type: string;
                title: string;
                description?: string;
                required?: string;
                options?: Function;
            };
        };
        visibleElement?: string | false;
        titleProperties?: string;
    }>;
}
