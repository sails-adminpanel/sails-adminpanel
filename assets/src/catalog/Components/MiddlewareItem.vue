<template>
	<div class="flex flex-col gap-2">
		<label class="admin-panel__title" for="root-group">Select Item</label>
		<select id="root-group" class="select min-w-[200px]">
			<option selected disabled>Select Item</option>
			<option v-for="item in items" :value="item">{{ item }}</option>
		</select>
	</div>
	<div>
		<span><b>OR</b></span>
	</div>
	<div>
		<div class="relative inline-flex">
			<button class="btn btn-add" @click="$emit('createNewItem')"><i
				class="las la-plus"></i><span>create new item</span>
			</button>
			<span v-if="getHTMLoading" class="loader-getHTML"></span>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from "vue";

const props = defineProps(['selectedItem', 'getHTMLoading'])
const emits = defineEmits(['createNewItem'])

let items = ref([])

onMounted(() => {
	items.value.push('123')
})
</script>


<style scoped>
.loader-getHTML {
	width: 24px;
	height: 24px;
	border: 5px dotted #000000;
	border-radius: 50%;
	display: inline-block;
	position: absolute;
	box-sizing: border-box;
	animation: rotation 2s linear infinite;
	right: -40px;
	top: 5px;
}

@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
