<template>
  <div v-if="schema && uischema" :class="[themeClass, 'myform', 'text', 'shadow']">  
    <div>Current step count: {{formData.currentStepCount}}</div>
    <div>{{formData.step.description}}</div>
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      :class="[themeClass,'form', 'shadow']"
      @change="onChange"
    />
    <button :disabled="!validationCallback" @click="sendDataToServer" class="step-button"> SEND </button>
    <button v-if="isSkippable" @click="skipStep" class="step-button"> SKIP </button>
    <button @click="toggleTheme" class="step-button">Toggle Theme</button>
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
// import "tailwindcss/tailwind.css";

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
      currentStepId: "",
      formData: null,
      validationCallback: false, 
      outputId: "",
      darkTheme: false, // Add a data property for toggling theme
    };
  },
  methods: {
    onChange(event) {
      // call error if output doesn't exist
      this.data = event.data;
      this.validationCallback = this.isDataFilled()

      if(this.validationCallback){
        let obj = {}
        if(this.formData.step.payload.type === "single"){
          obj[this.formData.step.payload.data.key] = this.data;
        }

        if(this.formData.step.payload.type === "multi"){
          for(let key in this.data){
            obj[key] = this.data[key];
          }
        }
        let recieve = {
          inputData: JSON.stringify(obj), 
          action: "next",
          currentStepId: this.currentStepId
        }

        // Convert JSON to string
        let jsonString = JSON.stringify(recieve);

        document.getElementById("installStepOutput").value = jsonString;
      }
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme; // Toggle dark theme boolean
      console.log(this.darkTheme, "AAAAAA")
    },
    addStepData(schema, uischema, data, formData) {
      // call error if output doesn't exists
      this.schema = schema;
      this.uischema = uischema;
      this.currentStepId = formData.step.id;
      this.isSkippable = formData.step.canBeSkipped;
      this.data = data
      this.formData = formData
    },
    addOutput(mountOutputId) {
      this.outputId = mountOutputId
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
        case "number":
          data[property] = 0;
          break;
        // case "array":
        //   data[property] = 0;
        //   break;
        default:
          data[property] = null;
          break;
      }
      }
      return data;
    },
    sendDataToServer() {
      // interface IData {
      //   inputData: key JSON,
      //   action: "next" || "skip",
      //   currentStepId: string
      // }
      let obj = {}
      if(this.formData.step.payload.type === "single"){
        obj[this.formData.step.payload.data.key] = this.data;
      }

      if(this.formData.step.payload.type === "multi"){
        for(let key in this.data){
          obj[key] = this.data[key];
        }
      }
      // JSON.stringify(obj)
      let recieve = {
        inputData: JSON.stringify(obj), 
        action: "next",
        currentStepId: this.currentStepId
      }

      // Convert JSON to string
      let jsonString = JSON.stringify(recieve);

      document.getElementById("installStepOutput").value = jsonString;


      // const API = "/admin/processInstallStep"

      // axios.post(API, recieve)
      //   .then(response => {
      //     location.reload();
      //     console.log('Data sent successfully:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error sending data:', error);
      //  });

    },
    skipStep(){
      let recieve = {
        action: "skip",
        currentStepId: this.currentStepId
      }

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
  isFormValid(){
    
  }

  },
  provide() {
    return {
      styles: myStyles,
    };
  },
  computed: {
    themeClass() {
      return this.darkTheme ? 'dark-theme' : 'light-theme'; // Apply appropriate theme class
    }
  }
});
</script>

<style scoped>
.light-theme {
  background-color: white;
  color: #333;
}

.dark-theme {
  background-color: black;
  color: white;
}

.mylabel {
  color: darkslategrey;
  font-size: 50px
}

.text-area {
  min-height: 80px;
}

.label  {
  padding-bottom: 1rem;
}

.form textarea{
  max-width: 200px;
  max-height: 200px;

  padding-top: .25rem;
  padding-bottom: .25rem;
  padding-left: .75rem;
  padding-right: .75rem;
}

.myform {
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.step-button {
  padding: 10px 20px;
  margin-right: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  transition: background-color 0.3s ease;
}

.step-button:hover {
  background-color: #0056b3;
}

.step-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.text {
  font-weight: 700;
  font-style: normal; 
  letter-spacing: .025em;
  text-transform: uppercase;
  font-size: .75rem;
  line-height: 1rem;
  padding-bottom: 1rem;
}

</style>


<!-- 

.input{
  padding-top: .25rem;
  padding-bottom: .25rem;
  padding-left: .75rem;
  padding-right: .75rem;

  background-color: rgba(243,244,246, 0.5);
  width: 100%;
}

.description {
  font-weight: 400;
  font-style: normal; 
  font-size: 1.5rem;
  line-height: 2rem;
}



  .jsonforms-control {
  margin-bottom: 20px;
  text-align: left;
}

.jsonforms-control label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.jsonforms-control input[type="text"],
.jsonforms-control textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

#control.validation{
  color: rgba(239,68,68);
  font-size: .75rem;
  line-height: 1rem;
  text-transform: uppercase;
}

.jsonforms-control textarea {
  min-height: 100px;
}

.jsonforms-control input[type="checkbox"],
.jsonforms-control input[type="radio"] {
  margin-right: 5px;
  cursor: pointer;
}

.jsonforms-validation-error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}
 -->