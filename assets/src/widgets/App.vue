<template>
	<div class="wrapper">
		<div id="test"></div>
		<div id="test2"></div>
		<div id="test3"></div>
		<div id="test4"></div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent( {
	name: "App"
})
</script>

<style scoped>
.wrapper{
	margin: 80px auto 0 auto;
	width: 600px;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
#test, #test2,
#test3, #test4{
	width: 40px;
	height: 40px;
	border: 1px solid black;
}
</style>
