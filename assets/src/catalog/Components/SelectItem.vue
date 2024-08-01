<template>
	<div class="modal-content">
		<div class="custom-catalog__form">
			<div class="flex flex-col gap-2">
				<label class="admin-panel__title" for="root-group">{{ $t('selectItemtype') }}</label>
				<select id="root-group" class="select" @change="create($event)">
					<option selected disabled value="">{{ $t('selectItems') }}</option>
					<option v-for="item in ItemsItem" :value="item.type">{{ item.name }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['initItemsItem', 'selectedNode'])
const emit = defineEmits(['createNewItem'])


let ItemsItem = computed(() => {
	if (props.selectedNode) {
		return props.initItemsItem
	} else {
		return props.initItemsItem.filter((item) => item.allowedRoot === true)
	}
})

function create(event) {
	emit("createNewItem", event.target.value)
	event.target.value = ''
}

</script>


<style scoped>

</style>
