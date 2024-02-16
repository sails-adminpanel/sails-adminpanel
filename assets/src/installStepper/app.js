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
  


export function MountJSONForm(options){
    let app = createApp(App);
    console.log(app)
    app.config.devtools = true;
    const appInstance = app.mount(options.mountDivId); // '#installStep'
    appInstance.addSchema(schema, uischema)
}

window.MountJSONForm = MountJSONForm

console.log("json-form")