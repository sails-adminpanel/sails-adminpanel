import { createApp } from 'vue';
import App from './App.vue'
import ky from "ky";


async function init() {
	return await ky.post('', { json: { _method: 'getLocales' } }).json()
}

init().then(({ data }) => {
	let app = createApp(App)
	app.provide('messages', data)
	app.mount('#catalog')
})

