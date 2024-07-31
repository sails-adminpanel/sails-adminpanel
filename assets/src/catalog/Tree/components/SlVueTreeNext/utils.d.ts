/**
 * Function to deeply merge two objects
 * Keeps keys from source if they don't exist in target. Otherwise, it overwrites the target value with the source value.
 * @param target The target object
 * @param source The source object
 * @returns The merged object
 */
export declare const deepMerge: (target: any, source: any) => any;
/**
 * Function to check if a value is an object
 * @param item The value to check
 * @returns Whether the value is an object
 */
export declare const isObject: (item: any) => boolean;
