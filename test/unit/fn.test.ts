function checkMIMEType(allowedTypes: string[], type: string) {
	const partsFileType = type.split('/');

	for (const type1 of allowedTypes) {
		let parts = type1.split('/');
		if(partsFileType[0] === parts[0]) {
			if(parts[1] === '*'){
				return false
			} else return parts[1] !== partsFileType[1];
		}
	}
}

const allowMIME = ['image/*', 'application/*', 'text/*']
console.log(checkMIMEType(allowMIME, 'image/png'))
