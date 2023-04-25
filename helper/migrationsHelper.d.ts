export declare class MigrationsHelper {
    private static queue;
    private static migrationsIsRunning;
    static processDatastoreAdapter(): void;
    private static runMigrations;
    static addToProcessMigrationsQueue(migrationsDirectory: string): Promise<void>;
    static processSpecificDirectoryMigrations(migrationsDirectory: string, action: "up" | "down", isInternal?: boolean): Promise<{
        success: boolean;
        time: number;
        message: string;
    }>;
}
