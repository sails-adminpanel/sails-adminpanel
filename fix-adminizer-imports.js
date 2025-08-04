// #!/usr/bin/env node

// const fs = require('fs');
// const path =     
    console.log(`🎉 Fixed ${fixedFiles} files with import issues`);
    
    // Дополнительно исправляем проблемы с import.meta.dirname
    fixImportMetaDirname();
}

// Функция для исправления import.meta.dirname в adminizer
function fixImportMetaDirname() {
    console.log('🔧 Fixing import.meta.dirname issues...');
    
    const filesToFix = [
        './node_modules/adminizer/lib/v4/PolicyManager.js',
        './node_modules/adminizer/lib/v4/model/adapter/waterline.js',
        './node_modules/adminizer/lib/v4/model/adapter/sequelize.js',
        './node_modules/adminizer/lib/Adminizer.js',
        './node_modules/adminizer/system/bindAssets.js',
        './node_modules/adminizer/system/bindMediaManager.js',
        './node_modules/adminizer/system/bindInertia.js',
        './node_modules/adminizer/system/bindModels.js',
        './node_modules/adminizer/helpers/viteHelper.js'
    ];
    
    let fixedMetaFiles = 0;
    filesToFix.forEach(file => {
        if (fs.existsSync(file) && fixImportMetaDirnameInFile(file)) {
            fixedMetaFiles++;
        }
    });
    
    console.log(`🎯 Fixed ${fixedMetaFiles} files with import.meta.dirname issues`);
}

// Функция для исправления import.meta.dirname в отдельном файле
function fixImportMetaDirnameInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем все вхождения import.meta.dirname на fallback
    const fixedContent = content.replace(
        /import\.meta\.dirname/g,
        '(import.meta.dirname || path.dirname(import.meta.url ? new URL(import.meta.url).pathname : __filename))'
    );
    
    if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✅ Fixed import.meta.dirname in: ${filePath}`);
        return true;
    }
    return false;quire('path');

// // Функция для рекурсивного поиска всех .js файлов
// function findJSFiles(dir, fileList = []) {
//     const files = fs.readdirSync(dir);
//     files.forEach(file => {
//         const filePath = path.join(dir, file);
//         const stat = fs.statSync(filePath);
//         if (stat.isDirectory()) {
//             findJSFiles(filePath, fileList);
//         } else if (file.endsWith('.js')) {
//             fileList.push(filePath);
//         }
//     });
//     return fileList;
// }

// // Функция для исправления импортов в файле
// function fixImportsInFile(filePath) {
//     const content = fs.readFileSync(filePath, 'utf8');
//     let hasChanges = false;
    
//     // Универсальное регулярное выражение для поиска всех импортов без расширения
//     const importRegex = /import\s+([^;]+)\s+from\s+['"]([^'"]+?)['"]/g;
//     let newContent = content.replace(importRegex, (match, imports, importPath) => {
//         // Пропускаем импорты из node_modules (не относительные пути)
//         if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
//             return match;
//         }
        
//         // Пропускаем импорты, которые уже имеют расширение
//         if (importPath.match(/\.\w+$/)) {
//             return match;
//         }
        
//         return `import ${imports} from "${importPath}.js"`;
//     });
//     if (newContent !== content) {
//         hasChanges = true;
//     }
    
//     if (hasChanges) {
//         fs.writeFileSync(filePath, newContent);
//         console.log(`✅ Fixed imports in: ${filePath}`);
//         return true;
//     }
//     return false;
// }

// // Основная функция
// function fixAdminizerImports() {
//     const adminizerPath = './node_modules/adminizer';
    
//     if (!fs.existsSync(adminizerPath)) {
//         console.log('❌ Adminizer not found in node_modules');
//         return;
//     }
    
//     console.log('🔍 Scanning for JS files in adminizer...');
//     const jsFiles = findJSFiles(adminizerPath);
    
//     console.log(`📁 Found ${jsFiles.length} JS files`);
    
//     let fixedFiles = 0;
//     jsFiles.forEach(file => {
//         if (fixImportsInFile(file)) {
//             fixedFiles++;
//         }
//     });
    
//     console.log(`🎉 Fixed ${fixedFiles} files with import issues`);
// }

// // Запуск скрипта
// if (require.main === module) {
//     fixAdminizerImports();
// }

// module.exports = { fixAdminizerImports };
