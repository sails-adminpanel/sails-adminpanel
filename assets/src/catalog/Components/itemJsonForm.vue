<template>
	<div class="mr-auto">
		<json-forms ref="refJsonForm" :init-data="data"/>
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
import {inject, onMounted, ref} from "vue";

const messages = inject('messages')
const props = defineProps(['schema', 'UISchema', 'type', 'parentId', 'data', 'PopupEvent'])
const emit = defineEmits(['closeAllPopups'])
let refJsonForm = ref(null)

onMounted(() => {
	refJsonForm.value.initializeData(props.schema, props.UISchema)
})

async function save() {
	let data = JSON.parse(document.getElementById('installStepOutput').value)
	data.type = props.type
	let res
	if (props.PopupEvent === 'create') {
		data.parentId = props.parentId ? props.parentId : null
		res = await ky.post('', {json: {data: data, _method: 'createItem'}}).json()
	} else {
		res = await ky.put('', {json: {type: props.type, data: data, id: data.id, _method: 'updateItem'}}).json()
	}
	if (res.data) emit('closeAllPopups')
}
</script>


<style scoped>

</style>
