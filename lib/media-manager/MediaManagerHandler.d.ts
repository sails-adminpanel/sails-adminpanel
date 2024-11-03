import { AbstractMediaManager } from "./AbstractMediaManager";
export declare class MediaManagerHandler {
    private static managers;
    static add(manager: AbstractMediaManager): void;
    static get(id: string): AbstractMediaManager;
}
