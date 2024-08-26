<template>
	<div class="p-10 max-w-[1440px] w-full mx-auto galleryRef overflow-y-auto h-full" ref="galleryRef">
		<div class="mx-auto mt-7 mb-11">
			<DropZone/>
		</div>
		<div class="flex justify-between">
			<div class="basis-3/4">
				<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
				<div class="relative">
					<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
							 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
						</svg>
					</div>
					<input type="search" id="default-search"
						   class="outline-none block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						   placeholder="Search..." required/>
				</div>
			</div>
			<svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
				<line x1="4" y1="7.5" x2="20" y2="7.5" stroke="black"/>
				<line x1="4" y1="14.5" x2="20" y2="14.5" stroke="black"/>
				<circle cx="9.5" cy="14.5" r="2.5" fill="black"/>
				<circle cx="14.5" cy="7.5" r="2.5" fill="black"/>
				<rect x="0.5" y="0.5" width="23" height="21" stroke="black"/>
			</svg>
		</div>
		<div class="flex justify-end">
			<div class="inline-flex gap-4 mb-4 pb-2 mt-4 text-sm border-b">
			<span class="text-gray-500 hover:text-green-700 cursor-pointer"
				  :class="layout?.name === 'Tile' ? 'active' : ''"
				  @click="changeLayout('tile')">Плитка</span>
				<span class="text-gray-500 hover:text-green-700 cursor-pointer"
					  :class="layout?.name === 'TableL' ? 'active' : ''" @click="changeLayout('table')">Таблица</span>
			</div>
		</div>
		<component :is="layout" :mediaList="mediaList"/>
		<div class="flex justify-center mt-4" v-if="next">
			<span class="load-more btn btn-back" @click="loadMore" v-if="isLoadMore">Load more</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Gallery',
}
</script>

<script setup>
import Tile from "./Tile.vue";
import TableL from "./TableL.vue";
import DropZone from "./DropZone.vue";
import {computed, inject, onMounted, ref, provide } from "vue";

const layout = ref(Tile)
const galleryRef = ref(null)
const uploadUrl = inject('uploadUrl')
const mediaList = ref([])
const skip = ref(0)
const isLoadMore = ref(true)
const next = ref(true)
const count = 5
const closeGallery = inject('closeGallery')

onMounted(async () => {
	let galleryPopup = AdminPopUp.new()
	galleryPopup.on('open', () => {
		galleryPopup.content.appendChild(galleryRef.value)
	})
	galleryPopup.on('close', () => {
		console.log('closed gallery')
		closeGallery()
	})
	await getData()
})

async function getData() {
	let data = await ky.get(`${uploadUrl}?count=${count}&skip=0`).json()
	mediaList.value = data.data
	console.log(data)
	isLoadMore.value = data.next
}

provide('pushData', (elem) => {
	mediaList.value = [...elem, ...mediaList.value]
})

provide('deleteData', (elem) => {
	mediaList.value = mediaList.value.filter(obj => obj.id !== elem.id)
})

// provide('updateData', (item) => {
// 	console.log(item)
// })

async function loadMore(){
	skip.value += count
	let data = await ky.get(`${uploadUrl}?count=${count}&skip=${skip.value}`).json()
	mediaList.value = [...mediaList.value, ...data.data]
	console.log(data)
	isLoadMore.value = data.next
}

function changeLayout(type) {
	switch (type) {
		case 'tile':
			layout.value = Tile
			break
		case 'table':
			layout.value = TableL
	}
}
</script>

<style scoped>
.active {
	color: black !important;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.galleryRef svg {
	fill: none !important;
}
</style>
