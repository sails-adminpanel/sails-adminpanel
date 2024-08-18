<template>
	<div class="flex flex-col">
		<div class="sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
				<div>
					<table
						class="min-w-full text-left text-sm font-light text-surface dark:text-white">
						<thead
							class="border-b border-neutral-200 font-medium dark:border-white/10">
						<tr>
							<th scope="col" class="p-2 text-left">Файл</th>
							<th scope="col" class="p-2 text-left">Имя</th>
							<th scope="col" class="p-2 text-left">Дата</th>
							<th scope="col" class="p-2 text-left">Тип</th>
							<th scope="col" class="p-2 text-left">Размер (orig.)</th>
							<th scope="col" class="p-2 text-left">W x H (orig.)</th>
							<th scope="col" class="p-2 text-left">Sizes</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(item, i) in mediaList" class="border-b border-neutral-200 dark:border-white/10 font-normal text-base">
							<td class="p-2">
								<Image :item="item" init-class="w-full h-full max-w-[75px]" alt=""/>
							</td>
							<td class="p-2">
								{{ item.filename }}
							</td>
							<td class="p-2">
								{{getDate(item.createdAt)}}
							</td>
							<td class="p-2">
								{{ fileType(item) }}
							</td>
							<td class="p-2">
								{{ (item.size / 1024 / 1024).toFixed(4) }} Mb
							</td>
							<td class="p-2">
								{{ imageSize(item.image_size) }}
							</td>
							<td class="p-2">
								<template v-if="item.children.length">
									<p v-for="size in item.children">
										{{ size.image_size.width }}x{{ size.image_size.height }}
									</p>
								</template>
								<span v-else>---</span>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TableL',
}
</script>

<script setup>
import Image from "./Image.vue";

const props = defineProps(['mediaList'])

function getDate(t){
	let date = new Date(t)
	return date.toLocaleDateString()
}

function imageSize(sizes){
	if(sizes){
		return `${sizes.width }x${sizes.height}`
	} else {
		return '---'
	}
}

function fileType(item){
	return item.url.split(/[#?]/)[0].split('.').pop().trim()
}

</script>

<style scoped>

</style>
