import { createApp } from 'vue'
import App from './App.vue'


export function MountMediaManager(data){
	let app = createApp(App);
	app.provide('uploadUrl', data.url)
	app.mount(data.id)
}

window.MountMediaManager = MountMediaManager
