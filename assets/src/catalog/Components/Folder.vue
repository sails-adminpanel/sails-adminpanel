<template>
	<div class="custom-catalog__form-input">
		<form action="" @submit.prevent="saveFolder" id="form" class="flex flex-col gap-4 mt-4">
			<div class="flex flex-col gap-3">
				<div class="admin-panel__wrapper-title">
					<label class="admin-panel__title" for="form-title">Title</label>
				</div>
				<div class="admin-panel__widget">
					<div class="widget_narrow ">
						<input class="text-input w-full" type="text" placeholder="Title" value="" name="title"
							   id="form-title" required/>
					</div>
				</div>
			</div>
			<div v-html="html"></div>
		</form>
		<div>
			<button class="btn btn-green" form="form" type="submit">
				Save
			</button>
		</div>
	</div>
</template>

<script setup>

const emit = defineEmits(['saveFolder'])
const props = defineProps(['html'])

function saveFolder(e) {
	let data = {
		data: {}
	}
	for (const eElement of e.target.elements) {
		if (eElement.value) {
			if (eElement.name === 'title') {
				data.title = eElement.value
			} else {
				data.data[eElement.name] = eElement.value
			}
		}
	}
	emit("saveFolder", 0, data)
}
</script>


<style scoped>

</style>
