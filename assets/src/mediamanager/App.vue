<template>
	<div>
		<div class="flex gap-2">
			<VueDraggableNext
				class="flex gap-2 flex-wrap"
				tag="div"
				:list="list"
				v-bind="{
					animation: 0,
        			group: uuid(),
        			disabled: false,
        			ghostClass: 'ghost',
				}"
				@start="dragging = true"
				@end="dragging = false"
			>
				<transition-group type="transition" name="flip-list">
					<div v-for="element in list" :key="element.id" class="flex gap-1">
						<img :src="element.src" alt="" class="cursor-move w-[100px] h-[100px] sm:w-[70px] sm:h-[70px]">
						<svg class="hover:text-red-600 transition w-3 h-3 cursor-pointer"
							 xmlns="http://www.w3.org/2000/svg" fill="none" @click="remove(element.id)"
							 viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
								  stroke-width="2"
								  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
						</svg>
					</div>
				</transition-group>
			</VueDraggableNext>
			<div
				class="w-[50px] h-[50px] flex-none flex justify-center items-center bg-gray-300 cursor-pointer hover:bg-gray-400 transition ml-2"
				@click="openPopup">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
					<path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/>
				</svg>
			</div>
		</div>
	</div>
	<Gallery v-if="galleryVisible" @closePopup="closePopup"></Gallery>
</template>

<script setup>
import {ref} from 'vue'
import Gallery from "./components/Gallery.vue";
import {VueDraggableNext} from 'vue-draggable-next'
import {v4 as uuid} from "uuid";

const list = ref([
	{
		id: 1,
		src: '/test/kandinsky-download-1722017335271.png'
	},
	{
		id: 2,
		src: '/test/kandinsky-download-1722022870430.png'
	},
	{
		id: 3,
		src: '/test/kandinsky-download-1722022966141.png'
	},
	{
		id: 4,
		src: '/test/kandinsky-download-1722023167578.png'
	},
	{
		id: 5,
		src: '/test/kandinsky-download-1722636944600.png'
	},
]);

const galleryVisible = ref(false)
const dragging = ref(false)

function openPopup() {
	galleryVisible.value = true
}

function closePopup() {
	galleryVisible.value = false
}

function remove(id) {
	list.value = list.value.filter(e => e.id !== id)
}

function checkMove() {
	console.log(list.value)
}

</script>

<style scoped>
.flip-list-move {
	transition: transform 0.2s;
}

.no-move {
	transition: transform 0s;
}

.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
