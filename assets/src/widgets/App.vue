<template>
	<div class="admin-widgets">
		<div class="admin-widgets__head">
			<div class="admin-widgets__head-left">
				<h1>Quick actions</h1>
			</div>
			<div class="admin-widgets__head-right">
				<div class="admin-widgets__head-info">?</div>
				<div class="admin-widgets__head-switcher">
					<input type="checkbox" id="stateChange" class="admin-switcher" role="switch" @change="editSwitch"
						   :checked="draggable">
				</div>
				<div class="admin-widgets__head-add">
					<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.125 26.25C13.9538 26.25 14.7487 25.9208 15.3347 25.3347C15.9208 24.7487 16.25 23.9538 16.25 23.125V16.25H23.125C23.9538 16.25 24.7487 15.9208 25.3347 15.3347C25.9208 14.7487 26.25 13.9538 26.25 13.125V6.875C26.25 6.0462 25.9208 5.25134 25.3347 4.66529C24.7487 4.07924 23.9538 3.75 23.125 3.75H6.875C6.0462 3.75 5.25134 4.07924 4.66529 4.66529C4.07924 5.25134 3.75 6.0462 3.75 6.875V23.125C3.75 23.9538 4.07924 24.7487 4.66529 25.3347C5.25134 25.9208 6.0462 26.25 6.875 26.25H13.125ZM13.75 13.75H6.25V6.875C6.25 6.70924 6.31585 6.55027 6.43306 6.43306C6.55027 6.31585 6.70924 6.25 6.875 6.25H13.75V13.75ZM23.125 13.75H16.25V6.25H23.125C23.2908 6.25 23.4497 6.31585 23.5669 6.43306C23.6842 6.55027 23.75 6.70924 23.75 6.875V13.125C23.75 13.2908 23.6842 13.4497 23.5669 13.5669C23.4497 13.6842 23.2908 13.75 23.125 13.75ZM13.125 23.75H6.875C6.70924 23.75 6.55027 23.6842 6.43306 23.5669C6.31585 23.4497 6.25 23.2908 6.25 23.125V16.25H13.75V23.125C13.75 23.2908 13.6842 23.4497 13.5669 23.5669C13.4497 23.6842 13.2908 23.75 13.125 23.75ZM22.3537 27.4913L22.5 27.5C22.8062 27.5 23.1017 27.3876 23.3305 27.1841C23.5593 26.9807 23.7054 26.7003 23.7412 26.3963L23.75 26.25V23.75H26.25C26.5562 23.75 26.8517 23.6376 27.0805 23.4341C27.3093 23.2307 27.4554 22.9503 27.4912 22.6463L27.5 22.5C27.5 22.1938 27.3876 21.8983 27.1841 21.6695C26.9807 21.4407 26.7003 21.2946 26.3963 21.2587L26.25 21.25H23.75V18.75C23.75 18.4438 23.6376 18.1483 23.4341 17.9195C23.2307 17.6907 22.9503 17.5446 22.6463 17.5087L22.5 17.5C22.1938 17.5 21.8983 17.6124 21.6695 17.8159C21.4407 18.0193 21.2946 18.2997 21.2588 18.6038L21.25 18.75V21.25H18.75C18.4438 21.25 18.1483 21.3624 17.9195 21.5659C17.6907 21.7693 17.5446 22.0497 17.5087 22.3537L17.5 22.5C17.5 22.8062 17.6124 23.1017 17.8159 23.3305C18.0193 23.5593 18.2997 23.7054 18.6038 23.7413L18.75 23.75H21.25V26.25C21.25 26.5562 21.3624 26.8517 21.5659 27.0805C21.7693 27.3093 22.0497 27.4554 22.3537 27.4913Z"/>
					</svg>
				</div>
			</div>
		</div>
		<div class="admin-widgets__widgets">
			<grid-layout
				v-model:layout="layout"
				:colNum="8"
				:rowHeight="131"
				:isResizable="resizable"
				:isDraggable="draggable"
				:responsive="true"
				:cols="{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 2 }"
				:breakpoints="{ lg: 1024, md: 768, sm: 425, xs: 320, xxs: 0 }"
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
						<div class="admin-widgets__flexible">
							<widget :widgets="widgets" :i="item.i" :draggable="draggable"
									@mousedown="mouseDownEditSwitch"
									@mouseup="mouseDownEditSwitch"></widget>
						</div>
					</grid-item>
				</template>
			</grid-layout>
		</div>
	</div>
	<div>
		<button class="btn-click" @click="initPopup">Click Me</button>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="child">
		<content-a @next="initPopup" v-if="index === 1"></content-a>
		<content-b @next="initPopup" v-if="index === 2" @closePopup="manualClosePopup(1)"></content-b>
		<content-c v-if="index === 3"></content-c>
	</pop-up>
</template>
<script>
import {defineComponent} from "vue";
import PopUp from "./PopUp.vue";
import ContentA from "./ContentA.vue";
import ContentB from "./ContentB.vue";
import ContentC from "./ContentC.vue";
import Widget from "./Widget.vue";

export default defineComponent({
	name: 'App',
	components: {PopUp, ContentA, ContentB, ContentC, Widget},
	data() {
		return {
			layout: window.widgetsInit.layout,
			widgets: window.widgetsInit.widgets,
			modalCount: 0,
			resizable: false,
			draggable: false,
			startTime: 0,
			endTime: 0
		}
	},
	mounted() {
		setTimeout(() => {
			document.getElementById('widgets').style.width = '99%'
		}, 100)
		console.log(this.widgets)
	},
	methods: {
		editSwitch() {
			this.flexWidget()
			this.draggable = !this.draggable
		},
		mouseDownEditSwitch(e) {
			if (!this.draggable) {
				if (e.type === 'mousedown') this.startTime = +new Date()
				if (e.type === 'mouseup') {
					this.endTime = +new Date()
					let time = this.endTime - this.startTime
					if (time >= 2000) {
						this.flexWidget()
						this.draggable = true
						this.startTime = 0
						this.endTime = 0
					}
				}
			}
		},
		flexWidget() {
			let widgets = document.querySelectorAll('.admin-widgets__flexible')
			for (const widget of widgets) {
				widget.classList.toggle('admin-widgets__flexible--flex')
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
		},
		moved(itemIdx) {
			localStorage.setItem('win_innerWidth', window.innerWidth.toString())
			localStorage.setItem('widgets_layout', JSON.stringify(this.layout))
		},
		resize(itemIdx) {
		}
	}
})
</script>
<style>
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
