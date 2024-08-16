<template>
	<div class="flex flex-col">
		<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
				<div>
					<table
						class="min-w-full text-left text-sm font-light text-surface dark:text-white">
						<thead
							class="border-b border-neutral-200 font-medium dark:border-white/10">
						<tr>
							<th scope="col" class="p-2 text-left">Файл</th>
							<th scope="col" class="p-2 text-left">Дата</th>
							<th scope="col" class="p-2 text-left">Тип</th>
							<th scope="col" class="p-2 text-left">Размер</th>
							<th scope="col" class="p-2 text-left">W x H</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(item, i) in mediaList" class="border-b border-neutral-200 dark:border-white/10 font-normal text-base">
							<td class="p-2">
								<img :src="item.url" alt="" class="w-full h-full max-w-[75px]">
							</td>
							<td class="p-2">
								{{getDate(item.parent.createdAt)}}
							</td>
							<td class="p-2">
								{{ item.parent.image_size.type }}
							</td>
							<td class="p-2">
								{{ (item.parent.size / 1024 / 1024).toFixed(2) }} Mb
							</td>
							<td class="p-2">
								{{ item.parent.image_size.width }} / {{ item.parent.image_size.height }}
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
const props = defineProps(['mediaList'])

function getDate(t){
	let date = new Date(t)
	return date.toLocaleDateString()
}
</script>

<style scoped>

</style>
