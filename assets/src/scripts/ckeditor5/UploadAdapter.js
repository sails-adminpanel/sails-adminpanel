export default class UploadAdapter {
	constructor(loader, url) {
		this.loader = loader;
		this.url = url
	}

	async upload() {
		const data = new FormData();
		let file = await this.loader.file
		data.append("name", file.name);
		data.append("image", file);

		try {
			let response = await fetch(this.url, {
				method: 'POST',
				body: data,
			})
			let result = await response.json()
			// Backstage returns data:
			// {"code":0,"msg":"success","data":{"url":"/upload/struts2.jpeg"}}

			// Method Returns data format: {Default: "URL"}
			return {
				default: result.url,
			};
		} catch (e) {
			console.error(e);
		}

	}
}
