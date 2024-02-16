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
    };
  },
  methods: {
    onChange(event) {
      this.data = event.data;
    },
    addSchema(schema, uischema) {
      this.schema = schema;
      this.uischema = uischema;
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
</style>