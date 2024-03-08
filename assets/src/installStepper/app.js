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

    // if uischema doesnt exist => generate
    if(appInstance.isEmpty(step?.uischema)){
      step.uischema = appInstance.generateUISchema(step?.schema)
    }
    // let UI = appInstance.generateUISchema(step?.schema)
    // console.log(appInstance.generateUISchema(step?.schema), "UI SHCEMa")
    // generate data
    let data = appInstance.initializeData(step.schema)
    console.log(data, "DATA")

    appInstance.addStepData(step.schema, step.uischema, step.id, step.canBeSkipped, data)

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