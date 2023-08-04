export declare class MigrationsHelper {
    private static queue;
    private static migrationsIsRunning;
    static processDatastoreAdapter(): void;
    private static runMigrations;
    static addToProcessMigrationsQueue(migrationsDirectory: string, action: "up" | "down"): Promise<void>;
    private static runMigrationsQueue;
    static processSpecificDirectoryMigrations(migrationsDirectory: string, action: "up" | "down"): Promise<void>;
}
