<template>
  <div v-if="schema && uischema" class="myform">
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
      validationCallback: () => {}, 
    };
  },
  methods: {
    onChange(event) {
      // call error if output doesn't exist
      this.data = event.data;
      this.validationCallback(isDataFilled()) 
    },
    addSchema(schema, uischema) {
      // call error if output doesn't exist
      this.schema = schema;
      this.uischema = uischema;
    },
    addOutput(mountInputId) {
      
    },
    setValidationCallback(cb){
      this.validationCallback = cb
    },
    isDataFilled() {
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
      const API = "http://localhost:1337/admin"

      axios.post(API, this.data)
        .then(response => {
          console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
         console.error('Error sending data:', error);
       });
  }

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
</style>