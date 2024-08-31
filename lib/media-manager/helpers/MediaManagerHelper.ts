export function randomFileName(filenameOrig: string, type: string, prefix: boolean) {
	// make random string in end of file
	const prefixLength = 8;
	const randomPrefix = prefix ? Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36) : ''

	return filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}${type}$&`)
}

const extensions = new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

export function isImage(type: string) {
	return extensions.has(type);
}
