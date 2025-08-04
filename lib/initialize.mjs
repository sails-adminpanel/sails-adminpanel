// ESM initialize.mjs - главная логика инициализации adminpanel
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initialize(sails, hook) {
    console.log('🚀 Starting adminpanel initialization...');
    
    try {
        // Динамически загружаем Adminizer, Waterline и sails-disk
        const [{ Adminizer, WaterlineAdapter }, Waterline, sailsDisk] = await Promise.all([
            import('adminizer'),
            import('waterline'),
            import('sails-disk')
        ]);
        
        console.log('✅ All dependencies loaded successfully');
        
        // Создаем ORM адаптеры с правильным Waterline адаптером
        const waterlineOrm = {
            orm: Waterline.default || Waterline,
            adapters: {
                'sails-disk': sailsDisk.default || sailsDisk
            }
        };
        
        const ormAdapters = [new WaterlineAdapter(waterlineOrm)];
        
        // Создаем Adminizer с ORM адаптерами
        console.log('⚙️ Creating Adminizer instance...');
        const adminizer = new Adminizer(ormAdapters);
        
        // Конфигурация для adminizer
        const adminpanelConfig = {
            routePrefix: sails.config.adminpanel?.routePrefix || '/admin',
            auth: sails.config.adminpanel?.auth || false,
            policies: [],
            system: {
                defaultORM: 'waterline'  // Указываем явно!
            },
            models: {}
        };
        
        // Инициализируем adminizer с конфигом
        console.log('🔄 Initializing Adminizer...');
        console.log('📋 Config:', JSON.stringify(adminpanelConfig, null, 2));
        console.log('🔧 ORM Adapters:', ormAdapters);
        await adminizer.init(adminpanelConfig);
        
        // Сохраняем adminizer в sails для доступа из других частей приложения
        sails.adminizer = adminizer;
        
        console.log('🎉 Adminpanel initialized successfully!');
        console.log(`📍 Admin panel available at: http://localhost:1337${adminpanelConfig.routePrefix}`);
        
    } catch (error) {
        console.error('❌ Failed to initialize adminpanel:', error);
        throw error;
    }
}
