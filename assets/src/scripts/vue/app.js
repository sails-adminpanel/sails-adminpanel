import { createApp } from 'vue';
import ckeditor5 from './components/CKeditor5.vue'

let app = createApp(ckeditor5);
app.config.devtools = true;
app.mount('#vue-app');