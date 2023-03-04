export default class MigrationsHelper {
    static processDatastoreAdapter(): void;
    private static runMigrations;
    static processMigrations(action: any): Promise<{
        success: boolean;
        time: number;
        message: string;
    }>;
}
