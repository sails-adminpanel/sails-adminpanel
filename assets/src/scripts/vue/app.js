import { createApp } from 'vue';
// import ckeditor5 from './components/CKeditor5.vue'
import CK5 from './components/CK5.vue'
import CKEditor from '@ckeditor/ckeditor5-vue';

let app = createApp(CK5);
app.use( CKEditor );
app.mount('#app');