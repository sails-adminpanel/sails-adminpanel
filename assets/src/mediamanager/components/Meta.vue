<template>
	<div class="p-10 max-w-[1440px] w-full mx-auto overflow-y-auto h-full" ref="metaRef">
		<form class="flex flex-col gap-4" ref="formRef">
			<div class="flex flex-col gap-4" v-for="(val, key, i) in fields">
				<label class="admin-panel__title"
					   for="author">{{key.replace(/^./, key[0].toUpperCase())}}</label>
				<input class="text-input w-3/4" :id="key" :name="key" :value="data[key]"/>
			</div>
		</form>
		<div class="mt-6">
			<button class="btn btn-green" @click="save">
				Save
			</button>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref, inject} from "vue";

const props = defineProps(['item'])

const metaRef = ref(null)
const formRef = ref(null)
const metaPopup = ref()
const closeMeta = inject('closeMeta')
const uploadUrl = inject('uploadUrl')
const fields = ref({})
const data = ref({})

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


async function getMeta() {
	let res = await ky.post(uploadUrl, {
		json: {
			metaId: props.item.meta,
			_method: 'getMeta',
		}
	}).json()
	console.log(res)
	if (res) {
		data.value = res.data
		fields.value = res.fields
	}
}

async function save() {
	let data = {}
	for (const element of formRef.value.elements) {
		data[element.name] = element.value
	}
	let res = await ky.post(uploadUrl, {
		json: {
			data: data,
			metaId: props.item.meta,
			_method: 'addMeta',
		}
	}).json()

	metaPopup.value.closeModal()
}

</script>

<style scoped>

</style>
