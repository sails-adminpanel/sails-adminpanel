<template>
	<grid-layout
		v-model:layout="layout"
		:col-num="8"
		:row-height="136"
	>
		<template #default="{ gridItemProps }">
			<grid-item
				v-for="item in layout"
				:key="item.i"
				v-bind="gridItemProps"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				@resize="resize"
				@move="move"
				@moved="moved"
			>
				<div class="widj-wrapper">
					{{ item.i + 1 }}
					<button v-if="item.i === 2" class="btn-click" @click="initPopup">Click Me</button>
				</div>
			</grid-item>
		</template>
	</grid-layout>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="child">
		<content-a @next="initPopup" v-if="index === 1"></content-a>
		<content-b @next="initPopup" v-if="index === 2" @closePopup="manualClosePopup(1)"></content-b>
		<content-c v-if="index === 3"></content-c>
	</pop-up>
	<pre>{{ widgets }}</pre>
</template>
<script>
import {defineComponent} from "vue";
import PopUp from "./PopUp.vue";
import ContentA from "./ContentA.vue";
import ContentB from "./ContentB.vue";
import ContentC from "./ContentC.vue";
import ky from "ky";

export default defineComponent({
	name: 'App',
	components: {PopUp, ContentA, ContentB, ContentC},
	data() {
		return {
			layout: [
				{x: 0, y: 0, w: 1, h: 1, i: 0},
				{x: 1, y: 0, w: 1, h: 1, i: 1},
				{x: 2, y: 0, w: 1, h: 1, i: 2},
				{x: 3, y: 0, w: 1, h: 1, i: 3},
				{x: 4, y: 0, w: 1, h: 1, i: 4},
				{x: 5, y: 0, w: 1, h: 1, i: 5},
				{x: 6, y: 0, w: 1, h: 1, i: 6},
				{x: 7, y: 0, w: 1, h: 1, i: 7},
				// {x: 8, y: 0, w: 1, h: 1, i: 8},
				// {x: 9, y: 0, w: 1, h: 1, i: 9},
				// {x: 10, y: 0, w: 1, h: 1, i: 10},
				// {x: 11, y: 0, w: 1, h: 1, i: 11}
			],
			//layout: [],
			widgets: null,
			modalCount: 0
		}
	},
	mounted() {
		this.getWidgets()
	},
	methods: {
		async getWidgets() {
			try {
				const res = await ky.get('/admin/widgets-get-all').json()
				this.widgets = res.widgets
			} catch (e) {
				console.log(e)
			}
		},
		manualClosePopup(index) {
			this.$refs.child[index].closePopup()
		},
		initPopup() {
			this.modalCount++
		},
		closePopup() {
			this.modalCount--
		},
		move(itemIdx) {
			console.log('move', itemIdx);
		},
		moved(itemIdx) {
			console.log('moved', itemIdx);
		},
		resize(itemIdx) {
			console.log('resized', itemIdx);
		}
	}
})
</script>
<style>
#widgets{
	max-width: 1300px;
	width: 100%;
}
.widj-wrapper {
	display: flex;
	flex-direction: column;
	gap: 20px;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.btn-click {
	background-color: #0d6efd;
	max-width: fit-content;
	padding: 0 20px;
	height: 30px;
	color: whitesmoke;
	border-radius: 5px;
	transition: all 0.3s ease-in-out;
}

.btn-click:hover {
	color: wheat;
	background-color: green;
}
</style>
