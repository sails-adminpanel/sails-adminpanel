<template>
	<div class="grid grid-cols-[repeat(auto-fill,_150px)] gap-2 justify-center">
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
