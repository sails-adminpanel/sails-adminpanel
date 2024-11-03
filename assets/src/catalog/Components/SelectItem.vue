<template>
	<div class="modal-content">
		<div class="custom-catalog__form">
			<div class="flex flex-col gap-2">
				<label class="admin-panel__title" for="root-group">{{ messages["Select Item type"] }}</label>
				<select id="root-group" class="select" @change="create($event)">
					<option selected disabled value="">{{ messages["Select Items"] }}</option>
					<option v-for="item in ItemsItem" :value="item.type" :disabled="checkPermission(item.type)">{{ item.name }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, inject} from "vue";

const messages = inject('messages')
const props = defineProps(['initItemsItem', 'selectedNode', 'movingGroupsRootOnly'])
const emit = defineEmits(['createNewItem'])

let ItemsItem = computed(() => {
	if (props.selectedNode.length) {
		return props.initItemsItem
	} else {
		return props.initItemsItem.filter((item) => item.allowedRoot === true)
	}
})

function checkPermission (type) {
	if (props.selectedNode.length && props.movingGroupsRootOnly) {
		return type === 'group'
	} else{
		return false
	}
}

function create(event) {
	emit("createNewItem", event.target.value)
	event.target.value = ''
}

</script>


<style scoped>

</style>
