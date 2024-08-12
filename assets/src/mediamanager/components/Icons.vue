<template>
	<div class="grid gap-2" :class="layoutClass">
		<div v-for="i in 10">
			<img src="https://imgholder.ru/500x500/8493a8/adb9ca.jpg&text=IMAGE+HOLDER&font=kelson" class="w-full h-full object-cover">
		</div>
	</div>
</template>

<script>
export default {
	name: 'Icons',
}
</script>

<script setup>
import {computed} from "vue";

const props = defineProps(['type'])

const layoutClass = computed(() => {
	if(props.type === 'bigIcons'){
		return 'grid-cols-4'
	} else if(props.type === 'smallIcons'){
		return 'grid-cols-8'
	}
})
</script>

<style scoped>

</style>
