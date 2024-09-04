<template>
	<div class="mr-auto">
		<json-forms ref="refJsonForm"/>
	</div>
	<textarea id="installStepOutput"></textarea>
	<div>
		<button class="btn btn-green" id="save-group" @click="save">
			{{ messages.Save }}
		</button>
	</div>

</template>

<script setup>
import JsonForms from '../../jsonForms/App.vue'
import {onMounted, ref, inject} from "vue";

const messages = inject('messages')
const props = defineProps(['schema', 'UISchema', 'actionId', 'selectedNode'])
const emit = defineEmits(['closeAllPopups'])
let refJsonForm = ref(null)

onMounted(() => {
	refJsonForm.value.initializeData(props.schema, props.UISchema)
})

async function save() {
	let content = JSON.parse(document.getElementById('installStepOutput').value)
	let data = {
		actionID: props.actionId,
		items: JSON.parse(props.selectedNode),
		config: content
	}
	let res = await ky.put('', {json: {data: data, _method: 'handleAction'}}).json()
	if (res.data.ok) emit('closeAllPopups')
}
</script>


<style scoped>

</style>
