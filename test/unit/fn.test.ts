function checkMIMEType(allowedTypes: string[], type: string) {
	const partsFileType = type.split('/');
	const allowedType = `${partsFileType[0]}/*`;
	if (allowedTypes.includes(allowedType)) return false
	return !allowedTypes.includes(type);

}

// const allowMIME = ['image/*', 'application/*', 'text/*']
// console.log(checkMIMEType(allowMIME, 'image/webp'))


let arr = [
	{
		name: 'a'
	},
	{
		name: 'b'
	},
	{
		name: 'c'
	}
]

for (const [key, value] of arr.entries()) {
	console.log(key, value)
}
