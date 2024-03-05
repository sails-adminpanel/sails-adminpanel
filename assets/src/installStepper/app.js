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


export function MountJSONForm(step){
    console.log(step, "STEPpp-----------------")
    let app = createApp(App);
    // console.log(app)
    app.config.devtools = true;
    const appInstance = app.mount(step.mountDivId); // '#installStep'
    // generate json schema

    // generate data
    // appInstance.initializeData(step.schema)

    appInstance.addSchema(step.schema, step.uischema)
    // if form validation is ok mountInputId have to receive value from form
    appInstance.addOutput(step.mountInputId)
    return appInstance
}

window.MountJSONForm = MountJSONForm

console.log("json-form")
