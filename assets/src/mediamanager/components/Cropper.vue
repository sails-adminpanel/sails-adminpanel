<template>
	<div class="px-12 py-14 max-w-[1440px] w-full mx-auto overflow-y-auto h-full" ref="cropperWrapperRef">
		<vue-cropper
			ref="vueCropperRef"
			class="max-h-[500px]"
			:src="imageSrc"
			alt="Source Image"
			v-bind="cropperOptions"
			@crop="onCrop"
		/>
		<label for="x">X</label>
		<input type="number" name="x" id="x" @input="vueCropperRef.setData({width: 100, height: 100})">
	</div>
</template>

<script setup>
import {ref, onMounted, inject, reactive} from 'vue'
import VueCropper from '@ballcat/vue-cropper';
import 'cropperjs/dist/cropper.css';

const props = defineProps(['imageSrc'])
const cropperWrapperRef = ref(null)
const vueCropperRef = ref(null);
const cropperPopup = ref()
const closeCropper = inject('closeCropper')

const cropperOptions = reactive({
	viewMode: 0,
	responsive: true,
	restore: true,
	checkCrossOrigin: true,
	checkOrientation: true,
	modal: true,
	guides: true,
	center: true,
	highlight: true,
	background: true,
	autoCrop: true,
	movable: true,
	rotatable: true,
	scalable: true,
	zoomable: true,
	zoomOnTouch: true,
	zoomOnWheel: true,
	cropBoxMovable: true,
	cropBoxResizable: true,
	toggleDragModeOnDblclick: true
})

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

function onCrop (e) {
	console.log(e)
}

// onMounted(() => {
// 	console.log(vueCropperRef.value.getData());
// });
</script>

<style scoped>

</style>
