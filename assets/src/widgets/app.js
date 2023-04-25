import { createApp } from 'vue';
import App from './App.vue'
import GridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'

let app = createApp(App);
app.config.devtools = true;
app.use(GridLayout)
app.mount('#widgets');
