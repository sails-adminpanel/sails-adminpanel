const path = require('path');
const fs = require('fs');
const { transformSync } = require('esbuild');
const Module = require('module');

// 1. Кэш для модулей
const moduleCache = new Map();

// 2. Перехватчик require для обработки ESM-модулей
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
	// Для внешних зависимостей (express, winston и т.д.)
	if (!id.startsWith('.') && !id.startsWith('/')) {
		return originalRequire(id);
	}

	// Для относительных путей
	const fullPath = path.resolve(path.dirname(this.filename), id);

	// Пробуем разные расширения
	const extensions = ['', '.js', '/index.js'];
	for (const ext of extensions) {
		const tryPath = fullPath + ext;
		if (fs.existsSync(tryPath)) {
			return loadESM(tryPath);
		}
	}

	throw new Error(`Cannot resolve ${id} from ${this.filename}`);
};

// 3. Загрузчик ESM-модулей
function loadESM(modulePath) {
	if (moduleCache.has(modulePath)) {
		return moduleCache.get(modulePath);
	}

	try {
		const code = fs.readFileSync(modulePath, 'utf8');

		// Трансформируем ESM в CJS
		const result = transformSync(code, {
			format: 'cjs',
			loader: 'js',
			sourcefile: modulePath,
			target: 'node16',
			// Важные настройки для корректной работы
			bundle: false,
			platform: 'node'
		});

		// Создаем обертку модуля
		const moduleExports = {};
		const moduleWrapper = {
			exports: moduleExports,
			filename: modulePath,
			id: modulePath,
			require: Module.prototype.require
		};

		// Выполняем код
		const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', result.code);
		fn(moduleWrapper, moduleExports, moduleWrapper.require, path.dirname(modulePath), modulePath);

		moduleCache.set(modulePath, moduleWrapper.exports);
		return moduleWrapper.exports;
	} catch (err) {
		console.error(`Failed to load ${modulePath}:`, err);
		throw err;
	}
}

// 4. Поиск точки входа Adminizer
function findAdminizerEntry() {
	const searchPaths = [
		path.join(__dirname, 'node_modules'),
		path.join(__dirname, '..', 'node_modules'),
		path.join(__dirname, '..', '..', 'node_modules')
	];

	const entries = [
		'adminizer/lib/Adminizer.js',
		'adminizer/dist/Adminizer.js',
		'adminizer/index.js'
	];

	for (const base of searchPaths) {
		for (const entry of entries) {
			const fullPath = path.join(base, entry);
			if (fs.existsSync(fullPath)) {
				return fullPath;
			}
		}
	}
	throw new Error('Adminizer entry point not found');
}

// 5. Основной экспорт
module.exports = function() {
	try {
		const entryPoint = findAdminizerEntry();
		console.log('Loading Adminizer from:', entryPoint);

		// Загружаем Adminizer
		const Adminizer = loadESM(entryPoint);

		// Восстанавливаем оригинальный require
		Module.prototype.require = originalRequire;

		return Adminizer;
	} catch (err) {
		// Всегда восстанавливаем require
		Module.prototype.require = originalRequire;
		console.error('Failed to initialize Adminizer:', err);
		process.exit(1);
	}
};
