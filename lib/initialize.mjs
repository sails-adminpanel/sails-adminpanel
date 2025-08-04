// ESM initialize.mjs - главная логика инициализации adminpanel
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initialize(sails, hook) {
    console.log('🚀 Starting adminpanel initialization...');

    try {
        // Динамически загружаем Adminizer и наш кастомный адаптер
        const [{ Adminizer }, { WaterlineAdapter }, Waterline, sailsDisk] = await Promise.all([
            import('adminizer'),
            import('./SailsORMAdapter.js'), // Используем наш кастомный адаптер
            import('waterline'),
            import('sails-disk')
        ]);

        console.log('✅ All dependencies loaded successfully');

        // Создаем отдельный ORM для системных моделей adminizer
        console.log('🔄 Creating separate ORM for adminizer system models...');
        const adminizerORM = new (Waterline.default || Waterline)();

        // Регистрируем системные модели из adminizer
        console.log('🔄 Registering adminizer system models...');
        await WaterlineAdapter.registerSystemModels(adminizerORM);

        // Настраиваем конфигурацию для adminizer ORM
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

        const adminizerConfig = {
            adapters: {
                'adminizerDisk': diskAdapterWithDefaults
            },
            datastores: {
                adminizer: {  // Используем уникальное имя datastore для adminizer
                    adapter: 'adminizerDisk',
                    inMemoryOnly: true
                }
            }
        };

        // Инициализируем adminizer ORM
        console.log('🔄 Initializing adminizer Waterline ORM...');
        const adminizerOntology = await new Promise((resolve, reject) => {
            adminizerORM.initialize(adminizerConfig, (err, ontology) => {
                if (err) return reject(err);
                resolve(ontology);
            });
        });

        // Создаем WaterlineAdapter с системными моделями
        const waterlineAdapter = new WaterlineAdapter({orm: adminizerORM, ontology: adminizerOntology});
        const ormAdapters = [waterlineAdapter];

        // Создаем Adminizer с ORM адаптерами
        console.log('⚙️ Creating Adminizer instance...');
        const adminizer = new Adminizer(ormAdapters);

        // Конфигурация для adminizer - добавляем MediaManager конфигурацию
        const adminpanelConfig = {
            routePrefix: sails.config.adminpanel?.routePrefix || '/admin',
            auth: sails.config.adminpanel?.auth || false,
            policies: [],
            system: {
                defaultORM: 'waterline'
            },
            models: {},
            mediamanager: { // Должно быть mediamanager, а не mediaManager
                fileStoragePath: './assets/uploads/', // Путь для загрузки файлов
                baseUrl: '/uploads/', // URL базовый путь для доступа к файлам
                maxFileSize: 10 * 1024 * 1024, // 10MB максимальный размер файла
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // Разрешенные типы
            }
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

		sails.hooks.http.app.use(adminizer.getMiddleware());
		let layer = sails.hooks.http.app._router.stack.slice(-1)[0]
		sails.hooks.http.app._router.stack.splice(1, 0, layer)

    } catch (error) {
        console.error('❌ Failed to initialize adminpanel:', error);
        throw error;
    }
}
