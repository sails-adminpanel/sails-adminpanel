/**
 * Type for functions that is controllers
 */
export type Action = (req: ReqType, res: ResType) => Promise<any>;
/**
 * Provide tools for hooks. Has only static methods.
 */
export default class HookTools {
    /**
     * Policies array is one for all project. It is not assigned with sails policies
     */
    private static policies;
    /**
     * Bind models from folder. Folder must be full path.
     * @param folder - path to models
     * @param modelsToSkip - list of models to skip
     */
    static bindModels(folder: string, modelsToSkip?: string[]): Promise<void>;
    /**
     * Check that config with name key exists in sails.config
     * @param key - name of config to check
     * @return true if config exists
     */
    static checkConfig(key: string): boolean;
    /**
     * Bind config from folder. Folder must be full path.
     * @param folder - path to models
     */
    static bindConfig(folder: string): Promise<void>;
    /**
     * Start cb function after given names of hooks. Call error with selfName if one of hooks not found
     * @param selfName - name of hook. Uses for debugging
     * @param hooks - array of names hooks to wait for
     * @param cb - function
     */
    static waitForHooks(selfName: string, hooks: string[], cb: (err?: Error) => void): void;
    /**
     * Bind function `action` to router `path` with method `method`. Use policies binding from this module.
     * @param path - /path/to/bind
     * @param action - function with Action type
     * @param method - GET or POST ot etc.
     */
    static bindRouter(path: string, action: Action, method?: string): void;
    private static bindPolicy;
    /**
     * Load policies from given folder.
     * Folder must contain index.js file that contain object with {'path/to/': policyName}, where /path/to/ is router or '*'
     * and policyName is one of others file name.
     * For example
     * |
     * * - index.js > module.exports = {
     * |                '/index': 'policy'
     * |              }
     * |
     * * - policy.js > module.exports = function (req: ReqType, res: ResType, next) {
     *                    return next();
     *                 }
     * @param folder - folder where policies load
     */
    static loadPolicies(folder: string): void;
}
