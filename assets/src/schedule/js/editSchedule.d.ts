export class EditSchedule {
    constructor(config: any);
    elName: any;
    field: any;
    dataInput: any;
    supportOldVersion: any;
    counter: number;
    propertyList: any;
    permutations: any;
    main(schedule: any): void;
    itemDown(button: any): void;
    itemUp(button: any): void;
    addschedule(schedule: any): void;
    deleteschedule(button: any): void;
    addTime(button: any, schedule: any): void;
    addDate(button: any, schedule: any): void;
    addBreak(button: any, schedule: any): void;
    deleteTime(button: any): void;
    deleteDate(button: any): void;
    deleteBreak(button: any): void;
    saveChanges(): void;
    fillPopUp(button: any): void;
    clearPopup(): void;
    addProperty(): void;
    recognizeType(inputValue: any): {
        inputType: string;
        defaultValue: string;
    };
    deleteProp(prop: any): void;
    editItem(schedule: any): void;
    getschedule(): string;
    getAttr(): any;
}
