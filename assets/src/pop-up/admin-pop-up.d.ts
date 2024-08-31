declare class PopUp {
    /** PopUp Div id */
    id: string;
    contentId: string | undefined;
    modal: any;
    content: any;
    protected eventHandlers: any;
    isClosing: boolean;
    constructor();
    protected open(): void;
    closeModal(): void;
    on(event: string, callback: () => void): void;
    trigger(event: string, eventParams?: {}): void;
    protected guidGenerator(): string;
}
export declare class AdminPopUp {
    static popups: PopUp[];
    static new(): PopUp;
    static closeAll(): void;
    private static offsetToggle;
}
export {};
