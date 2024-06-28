<template>
	<div class="custom-catalog__form-input">
		<form action="" @submit.prevent="saveItem" id="form" class="flex flex-col gap-4 mt-4">
			<div v-html="html" ref="embedded"></div>
		</form>
		<div>
			<button class="btn btn-green" form="form" type="submit">
				Save
			</button>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from "vue";

const props = defineProps(['html', 'itemType'])
const emit = defineEmits(['saveItem'])
let embedded = ref(null)

onMounted(() => {
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
})

function saveItem(e) {
	let data = {}

	setTimeout(() => {
		for (const eElement of e.target.elements) {
			if (eElement.value) {
				data[eElement.name] = eElement.value
			}
		}
		emit("saveItem", data)
	}, 10)
}
</script>


<style scoped>

</style>
