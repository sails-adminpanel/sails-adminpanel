// ESM initialize.mjs - главная логика инициализации adminpanel
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initialize(sails, hook) {
    console.log('🚀 Starting adminpanel initialization...');
    
    try {
        // Динамически загружаем Adminizer и WaterlineAdapter
        const [{ Adminizer, WaterlineAdapter }] = await Promise.all([
            import('adminizer')
        ]);
        
        console.log('✅ All dependencies loaded successfully');
        
        // Используем существующий ORM Sails.js
        console.log('🔄 Using existing Sails.js ORM...');
        
        // Получаем доступ к ontology Sails.js  
        const sailsORM = sails.hooks.orm;
        const ontology = sailsORM.ontology || sails.models;
        
        console.log('🔍 Available models in ontology:', Object.keys(ontology));
        
        const waterlineAdapter = new WaterlineAdapter({orm: sailsORM, ontology});
        const ormAdapters = [waterlineAdapter];
        
        // Создаем Adminizer с ORM адаптерами
        console.log('⚙️ Creating Adminizer instance...');
        const adminizer = new Adminizer(ormAdapters);
        
        // Конфигурация для adminizer - отключаем системные модели
        const adminpanelConfig = {
            routePrefix: sails.config.adminpanel?.routePrefix || '/admin',
            auth: sails.config.adminpanel?.auth || false,
            policies: [],
            system: {
                defaultORM: 'waterline'
            },
            models: {} // Пустые модели, чтобы избежать проблем с системными
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
