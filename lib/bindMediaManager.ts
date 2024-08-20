import {DefaultMediaManager} from "./media-manager/DefaultMediaManager";
import {MediaManagerHandler} from "./media-manager/MediaManagerHandler";

export default function bindMediaManager() {
	sails.after(["hook:orm:loaded"], async () => {
		try{
			let mediaManager = new DefaultMediaManager('default', 'media-manager', `${process.cwd()}/.tmp/public/media-manager/`, 'mediamanagerap', 'mediamanagermetaap')
			MediaManagerHandler.add(mediaManager)
		}catch (e) {
			console.log('bindMediaManager Error: ', e)
		}
	})
}
