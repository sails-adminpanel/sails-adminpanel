const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');
const { transformSync } = require('esbuild');

// 1. Кэш для загруженных модулей
const moduleCache = new Map();

// 2. Функция разрешения путей
function resolveModule(importingPath, specifier) {
	const baseDir = path.dirname(importingPath);
	const extensions = ['', '.js', '/index.js'];

	for (const ext of extensions) {
		const fullPath = path.join(baseDir, specifier + ext);
		if (fs.existsSync(fullPath)) {
			return fullPath;
		}
	}
	throw new Error(`Cannot resolve ${specifier} from ${importingPath}`);
}

// 3. Загрузчик с обработкой относительных путей
async function loadModule(modulePath) {
	if (moduleCache.has(modulePath)) {
		return moduleCache.get(modulePath);
	}

	try {
		// Читаем исходный код
		const code = fs.readFileSync(modulePath, 'utf8');

		// Трансформируем ESM в CJS
		const result = transformSync(code, {
			format: 'cjs',
			loader: 'js',
			sourcefile: modulePath,
			target: 'node14'
		});

		// Создаем виртуальный модуль
		const requireWrapper = `
            const __require = (path) => {
                const resolved = require('path').resolve('${path.dirname(modulePath)}', path);
                return require(resolved);
            };
            ${result.code}
        `;

		const moduleExports = {};
		const moduleWrapper = {
			exports: moduleExports,
			require: (p) => require(resolveModule(modulePath, p))
		};

		// Выполняем код
		const fn = new Function('module', 'exports', 'require', '__dirname', '__filename', requireWrapper);
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
		'adminizer/src/Adminizer.js',
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
module.exports = async function() {
	try {
		const entryPoint = findAdminizerEntry();
		console.log('Loading Adminizer from:', entryPoint);

		const Adminizer = await loadModule(entryPoint);
		return Adminizer;
	} catch (err) {
		console.error('Failed to initialize Adminizer:', err);
		process.exit(1);
	}
};
