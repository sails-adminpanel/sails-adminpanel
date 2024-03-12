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
    <button v-if="validationCallback" @click="sendDataToServer" class="step-button"> SEND </button>
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

// {
//         name: "Send email to Adrian",
//         description: "Confirm if you have passed the subject\nHereby ...",
//         done: true,
//         recurrence: "Daily",
//         rating: 3,
//       }

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
      validationCallback: false, 
    };
  },
  methods: {
    onChange(event) {
      // call error if output doesn't exist
      this.data = event.data;
      this.validationCallback = this.isDataFilled()
    },
    addStepData(schema, uischema, id, skippable, data) {
      // call error if output doesn't exists
      // if(this.isEmpty(schema) || this.isEmpty(uischema)){
      //   // sails.
      //   console.error("output doesn't exists")
      // }

      this.schema = schema;
      this.uischema = uischema;
      this.currentStepId = id;
      this.isSkippable = skippable;
      this.data = data
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
      // interface IData {
      //   inputData: JSON,
      //   action: "next" || "skip",
      //   currentStepId: string
      // }
      let recieve = {
        inputData: JSON.stringify(this.data),
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
         console.error('Error sending data:', error);
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