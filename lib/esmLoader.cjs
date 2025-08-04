const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

async function loadESM(modulePath, exportName = null) {
	try {
		// Если путь уже абсолютный - используем как есть, иначе резолвим относительно __dirname
		const absolutePath = path.isAbsolute(modulePath) 
			? modulePath 
			: path.resolve(__dirname, modulePath);

		// Проверяем существование файла
		if (!fs.existsSync(absolutePath)) {
			throw new Error(`File not found: ${absolutePath}`);
		}

		// Конвертируем в file:// URL
		const moduleUrl = pathToFileURL(absolutePath);

		// Динамический импорт
		const module = await import(moduleUrl);

		// Если указано имя экспорта - пытаемся его найти
		if (exportName) {
			return module[exportName] ||
				module.default?.[exportName] ||
				module.default;
		}

		// Если имя не указано - возвращаем весь модуль или default export
		return module.default || module;
	} catch (err) {
		console.error(`Error loading ESM module ${modulePath}:`, err);
		throw err;
	}
}

module.exports = loadESM;
