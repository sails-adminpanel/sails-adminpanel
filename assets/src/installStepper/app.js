import {createApp} from 'vue';
import App from './App.vue'

/** 
interface Ioptions {
    mountDivId: string,
    uischema: string,
    jsonschema: string,
    dataInputId: string,
    languages: ...
}
*/
// TODO: rename installStepper => jsonforms
 // id, uischema, jsonschema, data
export function MountJSONForm(){
    let app = createApp(App);
    app.config.devtools = true;
    app.mount('#installStep') // options.mountDivId); // '#installStep'
}

window.MountJSONForm = MountJSONForm

console.log("json-form")