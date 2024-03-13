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
      data: null,
      schema: null,
      uischema: null,
      isSkippable: false,
      action: "next",
      currentStepId: "",
      step: null,
      validationCallback: false, 
    };
  },
  methods: {
    onChange(event) {
      // call error if output doesn't exist
      this.data = event.data;
      this.validationCallback = this.isDataFilled()
    },
    addStepData(schema, uischema, data, step) {
      // call error if output doesn't exists
      // if(this.isEmpty(schema) || this.isEmpty(uischema)){
      //   // sails.
      //   console.error("output doesn't exists")
      // }

      this.schema = schema;
      this.uischema = uischema;
      this.currentStepId = step.step.id;
      this.isSkippable = step.step.canBeSkipped;
      this.data = data
      this.step = step
    },
    addOutput(mountInputId) {
      
    },
    // setValidationCallback(cb){
    //   this.validationCallback = cb
    // },
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
        case "number":
          data[property] = 0;
          break;
        default:
          data[property] = null;
          break;
      }
      }
      return data;
    },
    sendDataToServer() {
      // single key: JSON,
      // multi {key: value, key: value}
      
      // interface IData {
      //   inputData: key JSON,
      //   action: "next" || "skip",
      //   currentStepId: string
      // }
      let obj = {}
      if(this.step.step.payload.type === "single"){
        obj[this.step.step.payload.data.key] = this.data;
        console.log(obj, " OBJECT ")
      }

      if(this.step.step.payload.type === "multi"){
        // for (let i = 0; i < this.step.step.payload.data.length; i++) {
				//   obj[this.step.step.payload.data[i].key] = this.data[i];
			  // }
        for(let key in this.data){
          console.log(key, "key")
          console.log(this.step.step.payload.data, "this.step.step.payload.data")
          console.log(this.data, "this.data")
          console.log(this.data[key], "this.data[key]")
          obj[key] = this.data[key];

        }
        console.log(obj, " OBJECT ")
        console.log(this.data, " DATA AAAAAAAAA")
      }

      let recieve = {
        inputData: JSON.stringify(obj),
        action: this.action,
        currentStepId: this.currentStepId
      }
      console.log(recieve, "recieve")
      const API = "/admin/processInstallStep"

      axios.post(API, recieve)
        .then(response => {
          location.reload();
          console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
        //  console.error('Error sending data:', error);
       });

    },
    isEmpty(obj) {
      if(obj) return Object.keys(obj).length === 0;
      return true
    },
  generateSchema(data) {
    const schema = { properties: {} };
  
    data.forEach(field => {
      schema.properties[field.key] = {
        type: field.type,
        description: field.description,
        // tooltip: field.tooltip
      };
    });

    return schema;
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
  
    Object.keys(schema.properties).forEach((property) => {
      const layoutIndex = schema.properties[property].layoutIndex || 0; 
      const multi = schema.properties[property].multi || false; 
  
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