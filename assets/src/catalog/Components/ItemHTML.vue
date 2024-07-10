<template>
	<div class="modal-content">
		<div class="custom-catalog__form-input">
			<div class="flex flex-col gap-4 mt-4">
				<input type="checkbox" v-model="checkboxReady"
					   @change="() => {if(checkboxReady) $emit('closeAllPopups')}"
					   id="checkbox-ready" hidden>
				<input id="selectedNode" :value="id" hidden/>
				<div v-html="html" ref="embedded"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";

const props = defineProps(['html', 'selectedNode'])
const emit = defineEmits(['closeAllPopups'])
let embedded = ref(null)
let checkboxReady = ref(false)

let id = computed(() => {
	return props.selectedNode?.length === 1 ? props.selectedNode[0].data.id : null
})

onMounted(() => {
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
})

</script>


<style scoped>

</style>
