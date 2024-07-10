<template>
	<div class="modal-content">
		<div class="custom-catalog__form-input">
			<div class="flex flex-col gap-4 mt-4">
				<input type="checkbox" v-model="checkboxReady"
					   @change="() => {if(checkboxReady) $emit('closeAllPopups')}"
					   id="checkbox-ready" hidden>
				<div v-html="html" ref="embedded"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, watch, onMounted} from "vue";

const props = defineProps(['html'])
const emit = defineEmits(['closeAllPopups'])
let embedded = ref(null)
let checkboxReady = ref(false)

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
