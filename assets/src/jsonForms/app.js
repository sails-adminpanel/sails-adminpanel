import {createApp} from 'vue';
import App from './App.vue'

/**
interface Istep {
    mountDivId: string,
    uischema: string,
    jsonschema: string,
    dataInputId: string,
    languages: ...
}
*/
// TODO: rename installStepper => jsonforms
 // id, uischema, jsonschema, data
export function MountJSONForm(formData){
    console.log(formData, "FORM DATA")
    let app = createApp(App);
    app.config.devtools = true;
    const appInstance = app.mount(formData.mountDivId); // '#installStep'

    appInstance.isFormValid()
  
    if(formData.step.payload.type === "multi"){
      formData.schema = formData.step.payload.jsonSchema
      formData.uischema = formData.step.payload.uiSchema
    } 

    if(formData.step.payload.type === "single"){
      formData.uischema = formData.step.payload.data.uiSchema
      formData.schema = formData.step.payload.data.jsonSchema
    }

    // generate data object for input form
    let data = appInstance.initializeData(formData.schema)

    appInstance.addStepData(formData.schema, formData.uischema, data, formData)

    // if form validation is ok mountInputId have to receive value from form
    appInstance.addOutput(formData.mountDivOutput)
    
    return appInstance
}

window.MountJSONForm = MountJSONForm

console.log("json-form")
