<template>
	<div class="custom-catalog__form-input">
		<label for="folder">Folder name</label>
		<input type="text" name="folder" id="folder" v-model="folderName">
	</div>
	<div>
		<button class="btn btn-green" @click="saveFolder" :disabled="!folderName">
			Save
		</button>
		{{ folderName }}
	</div>
</template>

<script setup>
let folderName = defineModel()
const emit = defineEmits(['saveFolder'])

function saveFolder() {
	emit("saveFolder", 0, folderName)
}
</script>


<style scoped>

</style>
