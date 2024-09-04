<template>
	<div class="modal-content">
		<div class="custom-catalog__form-input">
			<div class="flex flex-col gap-4 mt-4">
				<input type="checkbox" v-model="checkboxReady"
					   @change="() => {if(checkboxReady) $emit('closeAllPopups')}"
					   id="checkbox-ready" hidden>
				<input id="parentId" :value="id" hidden/>
				<item-json-form v-if="isJsonForm" :schema="JSONFormSchema.schema" :UISchema="JSONFormSchema.UISchema"
								:type="JSONFormSchema.type" :data="JSONFormSchema.data" :parentId="id" :PopupEvent="PopupEvent" @closeAllPopups="closeAllPopups"/>
				<div v-else v-html="html" ref="embedded"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import itemJsonForm from './itemJsonForm.vue'

const props = defineProps(['html', 'selectedNode', 'isJsonForm', "JSONFormSchema", 'PopupEvent'])
const emit = defineEmits(['closeAllPopups'])
let embedded = ref(null)
let checkboxReady = ref(false)

let id = computed(() => {
	if(props.selectedNode.length){
		return !props.selectedNode[0].isLeaf ? props.selectedNode[0].data.id : ''
	} else{
		return ''
	}
})

onMounted(() => {
	if(!props.isJsonForm) {
		setTimeout(() => {
			const scripts = embedded.value.getElementsByTagName('script');
			let i = 1
			for (let script of scripts) {
				let elem = document.getElementById(`emb_${i}`)
				if (elem) elem.remove()
				const newScript = document.createElement('script');
				newScript.text = script.innerHTML;
				newScript.setAttribute('id', `emb_${i}`);
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
