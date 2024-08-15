<template>
	<div class="flex flex-col">
		<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
				<div class="overflow-hidden">
					<table
						class="min-w-full text-left text-sm font-light text-surface dark:text-white">
						<thead
							class="border-b border-neutral-200 font-medium dark:border-white/10">
						<tr>
							<th scope="col" class="p-2 text-left">#</th>
							<th scope="col" class="p-2 text-left">Img</th>
							<th scope="col" class="p-2 text-left">Дата</th>
							<th scope="col" class="p-2 text-left">Тип</th>
							<th scope="col" class="p-2 text-left">Размер</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="i in 10" class="border-b border-neutral-200 dark:border-white/10 text-lg">
							<td class="whitespace-nowrap px-6 py-4 font-medium">{{i}}</td>
							<td class="p-2 max-w-[150px]">
								img
							</td>
							<td class="p-2">
								10.10.10
							</td>
							<td class="p-2">
								jpg
							</td>
							<td class="p-2">
								20Kb
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
	name: 'Table',
}
</script>

<script setup>

</script>

<style scoped>

</style>
