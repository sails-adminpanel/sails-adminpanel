<template>
	<div class="pl-12 py-14 max-w-[1440px] w-full mx-auto overflow-y-auto h-full" ref="sizesRef">
		<div>
			<table
				class="min-w-full w-full text-left text-sm font-light text-surface dark:text-white">
				<colgroup>
					<col span="1" style="width: 40%;">
					<col span="1" style="width: 15%;">
					<col span="1" style="width: 15%;">
					<col span="1" style="width: 15%;">
					<col span="1" style="width: 15%;">
				</colgroup>
				<thead
					class="border-b border-neutral-200 font-medium dark:border-white/10">
				<tr>
					<th scope="col" class="p-2 text-left">Файл</th>
					<th scope="col" class="p-2 text-left">Размер</th>
					<th scope="col" class="p-2 text-left">Тип</th>
					<th scope="col" class="p-2 text-left">W x H</th>
					<th scope="col" class="p-2 text-left"></th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(item, i) in mediaList" class="border-b border-neutral-200 dark:border-white/10 font-normal text-base">
					<td class="p-2">
						<img :src="item.url" alt="" class="w-full h-full max-w-[250px]">
					</td>
					<td class="p-2">
						{{ (item.size / 1024 / 1024).toFixed(4) }} Mb
					</td>
					<td class="p-2">{{ item.mimeType}}</td>
					<td class="p-2">
						{{ item.image_size.width }}x{{ item.image_size.height }}
					</td>
					<td class="p-2">
						<button class="btn btn-back btn-text" @click="preview(item)">
							Preview
						</button>
					</td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref, inject} from "vue";
const sizesRef = ref(null)
const sizesPopup = ref()
const closeSizes = inject('closeSizes')
const props = defineProps(['item'])
const mediaList = ref([])
const uploadUrl = inject('uploadUrl')

onMounted(async () => {
	sizesPopup.value = AdminPopUp.new()
	sizesPopup.value.on('open', () => {
		sizesPopup.value.content.appendChild(sizesRef.value)
	})
	sizesPopup.value.on('close', () => {
		console.log('closed sizes')
		closeSizes()
	})
	await getData()
})

async function getData(){
	let res = await ky.post(uploadUrl, {json: {_method: 'getChildren', item: props.item,}}).json()
	if(res.data) {
		mediaList.value = [props.item, ...res.data]
	}
}

function getDate(t){
	let date = new Date(t)
	return date.toLocaleDateString()
}

function preview(item){
	window.open(item.url, '_blank').focus();
}

</script>

<style scoped>

</style>
