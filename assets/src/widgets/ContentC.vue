<template>
	<h1 class="text-2xl" v-html="msg"></h1>
</template>

<script>
export default {
	name: "ContentC",
	emits: ['next'],
	data(){
		return{
			msg: 'This is Content <b>C</b>. The end!'
		}
	}
}
</script>

<style scoped>

</style>
