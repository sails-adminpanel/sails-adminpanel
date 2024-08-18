<template>
	<div class="p-10 max-w-[1440px] w-full mx-auto overflow-y-auto h-full" ref="cropperWrapperRef">
		<vue-cropper
			ref="vueCropperRef"
			:src="imageSrc"
			alt="Source Image"
		/>
	</div>
</template>

<script setup>
import {ref, onMounted, inject} from 'vue'
import VueCropper from '@ballcat/vue-cropper';
import 'cropperjs/dist/cropper.css';

const props = defineProps(['imageSrc'])
const cropperWrapperRef = ref(null)
const vueCropperRef = ref(null);
const cropperPopup = ref()
const closeCropper = inject('closeCropper')

onMounted(async () => {
	cropperPopup.value = AdminPopUp.new()
	cropperPopup.value.on('open', () => {
		cropperPopup.value.content.appendChild(cropperWrapperRef.value)
	})
	cropperPopup.value.on('close', () => {
		console.log('closed cropper')
		closeCropper()
	})
})


// onMounted(() => {
// 	console.log(vueCropperRef.value.getData());
// });
</script>

<style scoped>

</style>
