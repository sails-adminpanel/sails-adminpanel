import {createApp} from 'vue';
import App from './App.vue'
import {createI18n} from 'vue-i18n';
import ky from "ky";


async function init() {
	return await ky.post('', {json: {_method: 'getLocales'}}).json()
}

init().then(({data}) => {
	const i18n = createI18n({
		locale: 'en',
		legacy: false,
		fallbackLocale: 'en',
		messages: data,
	});

	let app = createApp(App)
	app.use(i18n)
	app.mount('#catalog')
	i18n.global.locale.value = document.documentElement.lang
})

