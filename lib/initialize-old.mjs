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
        
        // Создаем новый Waterline ORM для системных моделей
        const orm = new (Waterline.default || Waterline)();
        
        // Регистрируем системные модели
        console.log('� Registering system models...');
        await WaterlineAdapter.registerSystemModels(orm);
        
        // Конфигурируем Waterline с sails-disk адаптером
        const diskAdapterWithDefaults = {
            ...(sailsDisk.default || sailsDisk),
            defaults: {
                migrate: 'alter',
                schema: true,
                attributes: {
                    id: {type: 'number', autoMigrations: {autoIncrement: true}},
                    createdAt: {type: 'number', autoMigrations: {columnType: 'bigint'}},
                    updatedAt: {type: 'number', autoMigrations: {columnType: 'bigint'}}
                }
            }
        };

        const waterlineConfig = {
            adapters: {
                'disk': diskAdapterWithDefaults
            },
            datastores: {
                adminpanel: {  // Используем уникальное имя для adminpanel
                    adapter: 'disk',
                    inMemoryOnly: true
                }
            }
        };

        // Инициализируем Waterline
        console.log('🔄 Initializing Waterline ORM...');
        const ontology = await new Promise((resolve, reject) => {
            orm.initialize(waterlineConfig, (err, ontology) => {
                if (err) return reject(err);
                resolve(ontology);
            });
        });

        const waterlineAdapter = new WaterlineAdapter({orm, ontology});
        const ormAdapters = [waterlineAdapter];
        
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
