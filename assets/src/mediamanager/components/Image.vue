<template>
	<div class="relative">
		<img :src="imageUrl" alt="" @contextmenu="openMenu" :class="initClass">
		<div class="contextmenu flex flex-col absolute opacity-0 invisible bg-gray-50" ref="menu">
			<ul class="custom-catalog__actions-items">
				<li class="capitalize" @click="openMeta">Редактировать</li>
				<li class="capitalize" @click="openFile">Посмотреть</li>
				<li v-if="imagesTypes.has(item.mimeType)" class="capitalize" @click="openCropper">Обрезать</li>
				<li v-if="imagesTypes.has(item.mimeType)" class="capitalize" @click="openSizes">Размеры</li>
			</ul>
		</div>
	</div>
	<Meta v-if="metaVisible" :item="item"/>
	<Cropper v-if="cropperVisible" :item="item"/>
	<Sizes v-if="sizesVisible" :item="item"/>
</template>

<script setup>
import Meta from "./Meta.vue";
import Cropper from "./Cropper.vue";
import Sizes from "./Sizes.vue";
import {provide, ref, computed, onMounted} from "vue";

const props = defineProps(['item', 'initClass'])
const metaVisible = ref(false)
const cropperVisible = ref(false)
const sizesVisible = ref(false)
const menu = ref(null)
const imagesTypes = new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

function openMeta() {
	metaVisible.value = true
}

provide('closeMeta', () => {
	metaVisible.value = false
	menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
})

function openCropper(){
	cropperVisible.value = true
}

provide('closeCropper', () => {
	cropperVisible.value = false
	menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
})

function openSizes(){
	sizesVisible.value = true
}

provide('closeSizes', () => {
	sizesVisible.value = false
	menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
})

const imageUrl = computed(() => {
	if (props.item.children.length) {

		return props.item.children.find(e => e.cropType === 'thumb').url
	} else {
		if (imagesTypes.has(props.item.mimeType)) {
			return props.item.url
		} else {
			return `/admin/assets/fileuploader/icons/${props.item.url.split(/[#?]/)[0].split('.').pop().trim()}.svg`
		}
	}
})


function openFile() {
	window.open(props.item.url, '_blank').focus();
}

function openMenu(e) {
	e.preventDefault()
	closeAllMenu()
	const ele = e.target
	const rect = ele.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	menu.value.style.top = `${y}px`
	menu.value.style.left = `${x}px`
	menuVisible(true)
	menu.value.previousSibling.classList.add('border-2', 'border-blue-500')
	const documentClickHandler = function () {
		// Hide the menu
		menuVisible(false)
		if(menu.value) menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
		// Remove the event handler
		document.removeEventListener('click', documentClickHandler);
	};
	document.addEventListener('click', documentClickHandler);
}

function menuVisible(bool) {
	if(menu.value) {
		menu.value.style.opacity = bool ? 1 : 0
		menu.value.style.visibility = bool ? 'visible' : 'hidden'
	}
}

function closeAllMenu() {
	const menus = document.querySelectorAll('.contextmenu')
	for (const menu1 of menus) {
		menu1.style.opacity = 0
		menu1.style.visibility = 'hidden'
		menu1.previousSibling.classList.remove('border-2', 'border-blue-500')
	}
}

</script>

<style scoped>

</style>
