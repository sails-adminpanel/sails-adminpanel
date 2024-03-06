<template>
  <div v-if="schema && uischema" class="myform text shadow">
    <h1>JSON Forms Vue 3</h1>
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      @change="onChange"
    />
    <button @click="sendDataToServer" class="step-button"> SEND </button>
    <button v-if="isSkippable" class="step-button"> SKIP </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { JsonForms } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import axios from 'axios'

// Merge default styles with custom styles
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

export default defineComponent({
  name: "App",
  components: {
    JsonForms,
  },
  data() {
    return {
      renderers: vanillaRenderers, // Use vanillaRenderers directly
      data: {
        name: "Send email to Adrian",
        description: "Confirm if you have passed the subject\nHereby ...",
        done: true,
        recurrence: "Daily",
        rating: 3,
      },
      schema: null,
      uischema: null,
      isSkippable: false,
      action: "",
      currentStepId: "",
      validationCallback: () => {}, 
    };
  },
  methods: {
    onChange(event) {
      // call error if output doesn't exist
      this.data = event.data;
      this.validationCallback(this.isDataFilled()) 
    },
    addStepData(schema, uischema, id, skippable) {
      // call error if output doesn't exists
      if(this.isEmpty(schema) || this.isEmpty(uischema)){
        // sails.
        console.error("output doesn't exists")
      }

      this.schema = schema;
      this.uischema = uischema;
      this.currentStepId = id,
      this.isSkippable = skippable
    },
    addOutput(mountInputId) {
      
    },
    setValidationCallback(cb){
      this.validationCallback = cb
    },
    isDataFilled(){
      const dataKeys = Object.keys(this.data);
      for (const key of dataKeys) {
        if (!this.data[key]) {
          return false;
        }
      }
      return true;
    },
    initializeData(schema) {
      const data = {};

      for (const property in schema.properties) {
      if (!schema.properties.hasOwnProperty(property)) continue; 

      const { type, enum: enumeration } = schema.properties[property];

      switch (type) {
        case "string":
          data[property] = enumeration?.[0] ?? "";
          break;
        case "boolean":
          data[property] = false;
          break;
        case "integer":
          data[property] = 0;
          break;
        default:
          break;
      }
      }
      return data;
    },
    sendDataToServer() {
      // interface IData {
      //   inputData: JSON,
      //   action "next" || "skip",
      //   currentStepId: string
      // }
      let recieve = {
        inputData: this.data,
        action: this.action,
        currentStepId: this.currentStepId
      }
      
      const API = "http://localhost:1337/admin"

      axios.post(API, recieve)
        .then(response => {
          console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
         console.error('Error sending data:', error);
       });
    },
    isEmpty(obj) {
      if(obj) return Object.keys(obj).length === 0;
      return true
    },
   generateUISchema(schema) {
    const uischema = {
      type: "HorizontalLayout",
      elements: [
        {
          type: "VerticalLayout",
          elements: [],
        },
      ],
    };
  
    // Helper function to add a Control element to the VerticalLayout
    function addControlElement(property, multi = false) {
      const controlElement = {
        type: "Control",
        scope: `#/properties/${property}`,
      };
  
      if (multi) {
        controlElement.options = {
          multi: true,
        };
      }
  
      return controlElement;
    }
  
    // Iterate through schema properties and add Control elements to uischema
    Object.keys(schema.properties).forEach((property) => {
      const layoutIndex = schema.properties[property].layoutIndex || 0; // Default to first VerticalLayout
      const multi = schema.properties[property].multi || false; // Check if multi-line is specified
  
      uischema.elements[layoutIndex].elements.push(addControlElement(property, multi));
    });
  
    return uischema;
  },


  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style scoped>
.mylabel {
  color: darkslategrey;
}

.myform {
  width: 640px;
  margin: 0 auto;
}

.text-area {
  min-height: 80px;
}

.text {
  font-weight: 400;
  font-style: normal; 
  font-size: 1.5rem;
  line-height: 2rem;
}



</style>