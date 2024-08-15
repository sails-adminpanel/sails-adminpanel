<template>
	<div class="flex flex-wrap gap-2 justify-items-start">
		<img :src="item.url"  v-for="item in mediaList" class="w-full h-full max-w-[150px]" alt="">
	</div>
</template>

<script>
export default {
	name: 'Icons',
}
</script>

<script setup>

const props = defineProps(['mediaList'])

</script>

<style scoped>

</style>
