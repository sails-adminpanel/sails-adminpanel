<template>
	<slot name="title"/>
	<h1 class="text-2xl" v-html="msg"></h1>
	<button class="btn-click" @click="next">Next</button>
	<input class="text-input w-full" type="text" v-model="input">
	<p>{{input}}</p>
	<button class="btn-click" @click="saveClose" style="background-color: green">Save and Close</button>
</template>

<script>

export default {
	name: "ContentB",
	emits: ['next', 'closePopup'],
	data(){
		return{
			msg: 'This is Content <b>B</b>',
			input: ''
		}
	},
	methods: {
		next(){
			this.$emit('next')
		},
		saveClose(){
			console.log(`This input data ${this.input}`)
			this.$emit('closePopup')
		}
	}
}
</script>

<style scoped>

</style>
