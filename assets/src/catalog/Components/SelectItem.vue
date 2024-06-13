<template>
	<div class="flex flex-col gap-2" v-if="isGroupRootAdd">
		<label class="admin-panel__title" for="root-group">Select and create root Group Item</label>
		<select id="root-group" class="select" @change="createNewFolder(true, $event)">
			<option selected disabled>Select Group</option>
			<option v-for="item in ItemsGroup" :value="item.type">{{ item.name }}</option>
		</select>
	</div>
	<div class="flex flex-col gap-2" v-if="isItemRootAdd">
		<label class="admin-panel__title" for="root-group">Select and create root Item</label>
		<select id="root-group" class="select" @change="createItem">
			<option selected disabled value="">Select Item</option>
			<option v-for="item in ItemsItem" :value="item.type">{{ item.name }}</option>
		</select>
	</div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['initItemsGroup', 'initItemsItem', 'isItemRootAdd', 'isGroupRootAdd'])
const emit = defineEmits(['createNewFolder', 'createNewItem'])

let ItemsGroup = computed(() => {
	return props.initItemsGroup.filter((item) => item.allowedRoot === true)
})
let ItemsItem = computed(() => {
	return props.initItemsItem.filter((item) => item.allowedRoot === true)
})

function createNewFolder(isNew, event){
	emit("createNewFolder", isNew, event.target.value)
}

function createItem(event){
	emit("createNewItem", event.target.value)
	event.target.value = ''
}
</script>


<style scoped>

</style>
