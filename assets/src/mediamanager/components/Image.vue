<template>
	<div class="relative">
		<div class="relative cursor-pointer">
			<img :src="imageUrl" alt="" @contextmenu="openMenu" :class="initClass"
				 @click="addItem(item)">
			<div class="absolute top-0 left-0 z-10 w-[20px] h-[20px] bg-white flex items-center justify-center" v-if="checkItem(item.id)">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200">
					<path fill="currentColor"
						  d="m1004.237 99.152l-611.44 611.441l-198.305-198.305L0 706.779l198.305 198.306l195.762 195.763L588.56 906.355L1200 294.916z"/>
				</svg>
			</div>
		</div>
		<div class="contextmenu flex flex-col absolute opacity-0 invisible bg-gray-50" ref="menu">
			<ul class="custom-catalog__actions-items">
				<li @click="openMeta">Meta данные</li>
				<li @click="openFile">Посмотреть</li>
				<li v-if="imagesTypes.has(item.mimeType)" @click="openCropper">Обрезать</li>
				<li v-if="imagesTypes.has(item.mimeType)" @click="openSizes">Размеры</li>
				<li @click="destroy">Удалить</li>
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
import {provide, ref, computed, inject} from "vue";

const props = defineProps(['item', 'initClass'])
const metaVisible = ref(false)
const cropperVisible = ref(false)
const sizesVisible = ref(false)
const menu = ref(null)
const uploadUrl = inject('uploadUrl')
const deleteData = inject('deleteData')
const addItem = inject('addItem')
const checkItem = inject('checkItem')
const imagesTypes = new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

async function destroy() {
	let res = await ky.delete(uploadUrl, {json: {item: props.item}}).json()
	if (res.msg === 'ok') deleteData(props.item)
}

function openMeta() {
	metaVisible.value = true
}

provide('closeMeta', () => {
	metaVisible.value = false
	menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
})

function openCropper() {
	cropperVisible.value = true
}

provide('closeCropper', () => {
	cropperVisible.value = false
	menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
})

function openSizes() {
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
		if (menu.value) menu.value.previousSibling.classList.remove('border-2', 'border-blue-500')
		// Remove the event handler
		document.removeEventListener('click', documentClickHandler);
	};
	document.addEventListener('click', documentClickHandler);
}

function menuVisible(bool) {
	if (menu.value) {
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
