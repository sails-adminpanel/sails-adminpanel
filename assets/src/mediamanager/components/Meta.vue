<template>
	<div class="p-10 max-w-[1440px] w-full mx-auto overflow-y-auto h-full" ref="metaRef">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-4">
				<label class="admin-panel__title"
					   for="author">Author</label>
				<input class="text-input w-3/4" id="author" name="author" v-model="author"/>
			</div>
			<div class="flex flex-col gap-4">
				<label class="admin-panel__title"
					   for="title">Title</label>
				<input class="text-input w-3/4" id="title" name="title" v-model="title"/>
			</div>
			<div class="flex flex-col gap-4">
				<label class="admin-panel__title"
					   for="description">Description</label>
				<input class="text-input w-3/4" id="description" name="description" v-model="description"/>
			</div>
			<p>
				<button class="btn btn-green" @click="save">
					Save
				</button>
			</p>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref, inject} from "vue";

const props = defineProps(['item'])

const metaRef = ref(null)
const metaPopup = ref()
const closeMeta = inject('closeMeta')
const description = ref('')
const title = ref('')
const author = ref('')
const uploadUrl = inject('uploadUrl')

onMounted(async () => {
	metaPopup.value = AdminPopUp.new()
	metaPopup.value.on('open', () => {
		metaPopup.value.content.appendChild(metaRef.value)
	})
	metaPopup.value.on('close', () => {
		console.log('closed meta')
		closeMeta()
	})
	await getMeta()
})

async function getMeta(){
	let res = await ky.post(uploadUrl, {json: {
			metaId: props.item.parent.meta,
			_method: 'getMeta',
		}}).json()
	title.value = res.data.title
	author.value = res.data.author
	description.value = res.data.description
}

async function save(){
	let res = await ky.post(uploadUrl, {json:{
			title: title.value,
			author: author.value,
			description: description.value,
			metaId: props.item.parent.meta,
			_method: 'addMeta',
		}}).json()

	metaPopup.value.closeModal()
}

</script>

<style scoped>

</style>
