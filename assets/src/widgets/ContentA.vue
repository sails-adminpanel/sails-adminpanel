<template>
	<h1 class="text-2xl" v-html="msg"></h1>
	<button class="btn-click" @click="next">Next</button>
</template>

<script>
export default {
	name: "ContentA",
	emits: ['next'],
	data(){
		return{
			msg: 'This is Content <b>A</b>'
		}
	},
	methods: {
		next(){
			this.$emit('next')
		}
	}
}
</script>

<style scoped>

</style>
