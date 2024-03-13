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
export function MountJSONForm(step){
    console.log(step, "STEP")
    let app = createApp(App);
    app.config.devtools = true;
    const appInstance = app.mount(step.mountDivId); // '#installStep'
    // if(appInstance.isEmpty(step?.uischema)){
    //   appInstance.generateSchema
    //   // step.uischema = appInstance.generateUISchema(step?.schema)
    //   // console.log(step.uischema)
    // }

    if(step.step.payload.type === "multi"){
      step.schema = appInstance.generateSchema(step.step.payload.data)
      step.uischema = step.step.payload.uiSchema
      // console.log(step.schema, step.step.payload.data, step.step.payload.uiSchema, "ALL DATA")
    } 
    if(step.step.payload.type === "single"){
      step.uischema = step.step.payload.data.uiSchema
      step.schema = step.step.payload.data.jsonSchema
      console.log(step.uischema, step.schema)
    }
    
    // generate data
    let data = appInstance.initializeData(step.schema)
    console.log(data, "DATA")

    appInstance.addStepData(step.schema, step.uischema, data, step)
    // if form validation is ok mountInputId have to receive value from form
    // appInstance.addOutput(step.mountInputId)
    return appInstance
}

window.MountJSONForm = MountJSONForm

console.log("json-form")




const schema = {
  properties: {
    name: {
      type: "string",
      minLength: 1,
      description: "The task's name"
    },
    description: {
      title: "Long Description",
      type: "string",
    },
    done: {
      type: "boolean",
    },
    dueDate: {
      type: "string",
      format: "date",
      description: "The task's due date"
    },
    rating: {
      type: "integer",
      maximum: 5,
    },
    recurrence: {
      type: "string",
      enum: ["Never", "Daily", "Weekly", "Monthly"]
    },
    recurrenceInterval: {
      type: "integer",
      description: "Days until recurrence"
    },
  },
};

const uischema = {
  type: "HorizontalLayout",
  elements: [
    {
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/name",
        },
        {
          type: "Control",
          scope: "#/properties/description",
          options: {
            multi: true,
          }
        },
        {
          type: "Control",
          scope: "#/properties/done",
        },
      ],
    },
    {
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/dueDate",
        },
        {
          type: "Control",
          scope: "#/properties/rating",
        },
        {
          type: "Control",
          scope: "#/properties/recurrence",
        },
        {
          type: "Control",
          scope: "#/properties/recurrenceInterval",
        },
      ],
    },
  ],
};