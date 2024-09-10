export class EditNavigation {
    constructor(config: any);
    elName: any;
    field: any;
    dataInput: any;
    counter: number;
    disableAddingProperty: any;
    disableDeletingProperty: any;
    maxNestedItems: any;
    visibleElement: any;
    titleProperties: any;
    propertyList: any;
    displacementControl: any;
    main(menu: any): void;
    logConfig(): void;
    saveChanges(): void;
    createDOM(data: any, menu: any): HTMLUListElement;
    giveItemsUniqueId(): void;
    addProperty(): void;
    deleteProp(prop: any): void;
    addItem(): void;
    deleteItem(item: any): void;
    recognizeType(inputValue: any): {
        inputType: string;
        defaultValue: string;
        required: string;
    };
    editItem(menu: any): void;
    itemUp(item: any): void;
    itemDown(item: any): void;
    changeEye(item: any): void;
    fillPopUp(item: any, menu: any): void;
    fillParentSelector(itemId: any, maxNestedItems: any, menu: any): void;
    clearPopup(): void;
    listToHierarchy(): any;
    getAttr(): any;
    getOptions(): {
        currElClass: string;
        placeholderClass: string;
        hintClass: string;
        listsClass: string;
        ignoreClass: string;
        insertZone: number;
        insertZonePlus: boolean;
        scroll: number;
        opener: {
            active: boolean;
            as: string;
            close: string;
            open: string;
        };
        isAllowed: (currEl: any, hint: any, target: any) => boolean;
        onChange: () => void;
        start: (e: any, ui: any) => void;
    };
}
