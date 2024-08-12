<template>
	<div class="flex flex-col gap-4">
		<span>Загрузка галереи изображений:</span>
		<div class="flex gap-2">
			<div>132132</div>
			<div>132132</div>
			<div>132132</div>
			<div>132132</div>
			<div>132132</div>
			<div class="w-[34px] h-[34px] flex justify-center items-center bg-gray-300 cursor-pointer hover:bg-gray-400 transition" @click="state.galleryVisible.value = true">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
			</div>
		</div>
	</div>
	<Gallery v-if="state.galleryVisible.value"></Gallery>
</template>

<script setup>
import {state} from "./services/popupState.js";
import Gallery from "./components/Gallery.vue";

</script>

<style scoped>

</style>
