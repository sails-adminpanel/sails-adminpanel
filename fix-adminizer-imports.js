#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска всех .js файлов
function findJSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findJSFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Функция для исправления импортов в файле
function fixImportsInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Расширенное регулярное выражение для поиска всех импортов без .js
    const importRegex = /import\s+([^;]+)\s+from\s+['"]((\.{1,2}|\/)[^'";]*?)(?<!\.js)['"]/g;
    let newContent = content.replace(importRegex, (match, imports, importPath) => {
        // Проверяем, не заканчивается ли путь уже на .js
        if (importPath.endsWith('.js')) {
            return match;
        }
        return `import ${imports} from "${importPath}.js"`;
    });
    if (newContent !== content) {
        hasChanges = true;
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ Fixed imports in: ${filePath}`);
        return true;
    }
    return false;
}

// Основная функция
function fixAdminizerImports() {
    const adminizerPath = './node_modules/adminizer';
    
    if (!fs.existsSync(adminizerPath)) {
        console.log('❌ Adminizer not found in node_modules');
        return;
    }
    
    console.log('🔍 Scanning for JS files in adminizer...');
    const jsFiles = findJSFiles(adminizerPath);
    
    console.log(`📁 Found ${jsFiles.length} JS files`);
    
    let fixedFiles = 0;
    jsFiles.forEach(file => {
        if (fixImportsInFile(file)) {
            fixedFiles++;
        }
    });
    
    console.log(`🎉 Fixed ${fixedFiles} files with import issues`);
}

// Запуск скрипта
if (require.main === module) {
    fixAdminizerImports();
}

module.exports = { fixAdminizerImports };
