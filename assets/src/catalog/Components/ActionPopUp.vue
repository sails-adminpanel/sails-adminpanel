<template>
	<div class="modal-content">
		<div class="custom-catalog__form-input">
			<input type="checkbox" v-model="checkboxReady"
				   @change="() => {if(checkboxReady) $emit('closeAllPopups')}"
				   id="checkbox-ready" hidden="">
			<textarea  id="selectedNode" v-html="JSON.stringify(selectedNode)" hidden></textarea>
			<div class="flex flex-col gap-4 mt-4">
				<action-json-form v-if="isJsonForm" :schema="JSONFormSchema.schema" :UISchema="JSONFormSchema.UISchema" :actionId="actionId"
								  :selectedNode="JSON.stringify(selectedNode)" @closeAllPopups="closeAllPopups" />
				<div v-html="html" ref="embedded" v-else></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import ActionJsonForm from './ActionJsonForm.vue'
const props = defineProps(['html', 'isJsonForm', 'JSONFormSchema', 'selectedNode', 'actionId'])
const emit = defineEmits(['closeAllPopups'])
let embedded = ref(null)
let checkboxReady = ref(false)

onMounted(() => {
	if(!props.isJsonForm) {
		setTimeout(() => {
			const scripts = embedded.value.getElementsByTagName('script');
			let i = 1
			for (let script of scripts) {
				let elem = document.getElementById(`${props.itemType}_${i}`)
				if (elem) elem.remove()
				const newScript = document.createElement('script');
				newScript.text = script.innerHTML;
				newScript.setAttribute('id', `${props.itemType}_${i}`);
				document.body.appendChild(newScript)
				i++
			}
		}, 0)
	}
})

function closeAllPopups(){
	emit('closeAllPopups')
}
</script>


<style scoped>

</style>
