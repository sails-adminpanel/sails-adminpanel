function getConvertExtensions(s: string): string {
	const obj:{[key: string]: string} = {
		"image/jpeg": "jpg",
		"image/webp": "webp"
	}
	return obj[s]
}

console.log(getConvertExtensions('image/webp'))
