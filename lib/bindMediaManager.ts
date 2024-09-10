import { DefaultMediaManager } from "./media-manager/DefaultMediaManager";
import { MediaManagerHandler } from "./media-manager/MediaManagerHandler";

export default function bindMediaManager() {
	sails.after(["hook:orm:loaded"], async () => {
		try {
			let mediaManager = new DefaultMediaManager('default', 'media-manager', `${process.cwd()}/.tmp/public/media-manager/`)
			MediaManagerHandler.add(mediaManager)
			let mediaManager2 = new DefaultMediaManager('test', 'media-manager2', `${process.cwd()}/.tmp/public/media-manager2/`)
			MediaManagerHandler.add(mediaManager2)
		} catch (e) {
			console.log('bindMediaManager Error: ', e)
		}
	})
}
