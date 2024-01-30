export default class Router {
    static onlyOnce: boolean;
    /**
     * The idea is that all methods within the first 3 seconds after start call this method, and as soon as all have been loaded, the loading will be blocked
     */
    static bind(): void;
}
