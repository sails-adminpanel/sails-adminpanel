import { createApp } from 'vue';
import App from './App.vue'

let app = createApp(App);
app.config.devtools = true;
app.mount('#widgets');
