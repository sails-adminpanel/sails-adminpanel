import { DefaultMediaManager } from "../lib/media-manager/DefaultMediaManager";
import { MediaManagerHandler } from "../lib/media-manager/MediaManagerHandler";

export default function bindMediaManager() {
	sails.after(["hook:orm:loaded"], async () => {
		try {
			let mediaManager = new DefaultMediaManager('default', 'media-manager', `${process.cwd()}/.tmp/public/media-manager/`)
			MediaManagerHandler.add(mediaManager)
		} catch (e) {
			console.log('bindMediaManager Error: ', e)
		}
	})
}
