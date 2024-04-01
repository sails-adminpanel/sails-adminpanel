<template>
  <div v-if="schema && uischema" :class="[themeClass, 'template']">  
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      :class="[themeClass]"
      @change="onChange"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { JsonForms } from "@jsonforms/vue";
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
  vanillaStyles
} from "@jsonforms/vue-vanilla";
// import "tailwindcss/tailwind.css";

// Merge default styles with custom styles
const myStyles = mergeStyles(defaultStyles, {
   control: {
      root: 'control',
      wrapper: 'wrapper',
      label: 'label',
      description: 'description',
      input: 'text-input',
      error: 'error',
      textarea: 'text-area',
      select: 'select',
      option: 'option',
    },
    arrayList: {
      root: 'array-list'
    },
    // text-input
  });

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
      const dataValidBySchema = {}

      if(this?.validationCallback && typeof this.validationCallback === "function"){
        this.validationCallback( event?.errors.length > 0 )
      }

      if(this.isDataFilled()){

        // let obj = {}
        // if(this.formData.stepData.payload.type === "single"){
        //   obj[this.formData.stepData.payload.data.key] = this.data;
        // }

        // if(this.formData.stepData.payload.type === "multi"){
        //   for(let key in this.data){
        //     obj[key] = this.data[key];
        //   }
        // }

        // for(let key in this.data){
        //     obj[key] = this.data[key];
        //  }
        console.log("Data on change: ",this.data)

        let recieve = JSON.stringify(this.data);

        document.getElementById("installStepOutput").value = recieve;
      }
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme; // Toggle dark theme boolean
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
    initializeData(schema, uiSchema) {
      let data = {};
      this.schema = schema;
      this.uischema = uiSchema;

      if(schema.type === "object"){
        for (const property in schema.properties) {

        if (!schema.properties.hasOwnProperty(property)) continue; 

        const { type, enum: enumeration } = schema.properties[property];

        data = this.setData(type, property, enumeration, data)
        }
      } else{
        // data = this.setData(schema.type, null, null, data)
        data = []
      }
      
      this.data = data;
    },
    setData(type, property, enumeration, data){
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
           case "array":
            data[property] = null;
            break;
          default:
            data[property] = null;
            break;
        }
        return data;
    },
    isEmpty(obj) {
      if(obj) return Object.keys(obj).length === 0;
      return true
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
  background-color: rgb(249 250 251, 1);
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

.control {
  font-size: 0.75rem;
  text-align: left;
  margin-top: 0.5em;
  min-height: 1em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1em;
}

.control>.input-description, .control>.validation {
  font-size: 0.75rem;
  text-align: left;
  margin-top: 0.5em;
  min-height: 1em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  line-height: 1em;
}
.control>.input {
  border-style: solid;
  border-width: thin;
  border-radius: 0.2em;
  border-color: var(--jsf-border-color);
  padding: 0.2em;
  color: var(--jsf-main-fg-color);
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