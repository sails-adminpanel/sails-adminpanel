const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

async function loadESM(relativePath, exportName = null) {
	try {
		// Получаем абсолютный путь
		const absolutePath = path.resolve(__dirname, relativePath);

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
		console.error(`Error loading ESM module ${relativePath}:`, err);
		throw err;
	}
}

module.exports = loadESM;
