<template>
	<div class="custom-catalog__form-input">
		<label for="folder">Item name</label>
		<input type="text" name="folder" id="folder" v-model="itemName">
	</div>
	<div>
		<button class="btn btn-green" @click="saveItem" :disabled="!itemName">
			Save
		</button>
		{{ itemName }}
	</div>
</template>

<script setup>
let itemName = defineModel()
const emit = defineEmits(['saveItem'])

function saveItem() {
	emit("saveItem", 0, itemName)
}
</script>


<style scoped>

</style>
