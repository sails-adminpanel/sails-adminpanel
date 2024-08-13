<template>
	<div class="p-10 max-w-[1440px] w-full mx-auto galleryRef" ref="galleryRef">
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
		<div class="flex gap-4 mb-4 border-b-2 pb-2">
			<span class="text-xl text-gray-500 hover:text-green-700 cursor-pointer"
				  :class="iconsType === 'bigIcons' ? 'active' : ''"
				  @click="changeLayout('bigIcons')">Крупные значки</span>
			<span class="text-xl text-gray-500 hover:text-green-700 cursor-pointer"
				  :class="iconsType === 'smallIcons' ? 'active' : ''"
				  @click="changeLayout('smallIcons')">Мелкие значки</span>
			<span class="text-xl text-gray-500 hover:text-green-700 cursor-pointer"
				  :class="layout?.name === 'Table' ? 'active' : ''" @click="changeLayout('table')">Таблица</span>
		</div>
		<transition name="fade" mode="out-in" appear>
			<component :is="layout" :type="iconsType" :key="iconsType"/>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'Gallery',
}
</script>

<script setup>
import Icons from "./Icons.vue";
import Table from "./Table.vue";
import DropZone from "./DropZone.vue";
import {computed, onMounted, ref} from "vue";


const layout = ref(Icons)
const iconsType = ref('bigIcons')
const galleryRef = ref(null)

const emit = defineEmits(['closePopup'])

onMounted(() => {
	let galleryPopup = AdminPopUp.new()
	galleryPopup.on('open', () => {
		galleryPopup.content.appendChild(galleryRef.value)
	})
	galleryPopup.on('close', () => {
		console.log('closed gallery')
		emit('closePopup')
	})
})

function changeLayout(type) {
	iconsType.value = type
	switch (type) {
		case 'bigIcons':
			layout.value = Icons
			break
		case 'smallIcons':
			layout.value = Icons
			break
		case 'table':
			layout.value = Table
	}
}
</script>

<style scoped>
.active{
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
.galleryRef svg{
	fill: none !important;
}
</style>
