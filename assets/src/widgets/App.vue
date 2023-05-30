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
				<div class="admin-widgets__head-add" @click="initPopup">
					<i class="icon-add las la-plus-square"></i>
				</div>
			</div>
		</div>
		<div class="admin-widgets__widgets" v-if="layout.length">
			<grid-layout
				v-model:layout="layout"
				:colNum="8"
				:rowHeight="131"
				:isResizable="resizable"
				:isDraggable="draggable"
				:responsive="true"
				:cols="{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 2 }"
				:breakpoints="{ lg: 1024, md: 768, sm: 475, xs: 320, xxs: 0 }"
				:key="keyRender"
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
							<widget :widgets="widgets" :draggable="draggable" :ID="item.id"
									@mousedown="mouseDownEditSwitch"
									@mouseup="mouseDownEditSwitch"
							></widget>
						</div>
					</grid-item>
				</template>
			</grid-layout>
		</div>
		<div class="admin-widgets__widgets" v-else>
			<div class="admin-widgets__init">
				<p>You don't have any widgets selected yet. You can add them by clicking on the plus sign at the top
					right.</p>
			</div>
		</div>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="child">
		<add-widgets @addWidgets="addWidgets" v-if="index === 1" :initWidgets="widgets" :block="block"></add-widgets>
<!--		<content-a @next="initPopup" v-if="index === 2"></content-a>-->
<!--		<content-b @next="initPopup" v-if="index === 3" @closePopup="manualClosePopup(1)"></content-b>-->
<!--		<content-c v-if="index === 3"></content-c>-->
	</pop-up>
</template>
<script>
import {defineComponent} from "vue";
import PopUp from "./PopUp.vue";
import ContentA from "./ContentA.vue";
import ContentB from "./ContentB.vue";
import ContentC from "./ContentC.vue";
import AddWidgets from "./AddWidgets.vue";
import Widget from "./Widget.vue";
import ky from "ky";

export default defineComponent({
	name: 'App',
	components: {PopUp, ContentA, ContentB, ContentC, Widget, AddWidgets},
	data() {
		return {
			layout: window.widgetsInit.layout,
			widgets: window.widgetsInit.widgets,
			modalCount: 0,
			resizable: false,
			draggable: false,
			startTime: 0,
			endTime: 0,
			keyRender: 0,
			block: false
		}
	},
	mounted() {
		setTimeout(() => {
			document.getElementById('widgets').style.width = '100%'
		}, 100)
		//console.log(window.widgetsInit.layout)
	},
	methods: {
		async addWidgets(id) {
			document.getElementById('widgets').style.width = '99%'
			this.block = !this.block
			let layoutItem = this.layout.find(e => e.id === id)
			if (layoutItem) {
				this.layout = this.layout.filter(e => e.id !== id)
			} else {
				let widget = this.widgets.find(e => e.id === id)
				let w = widget.size ? widget.size.w : 1
				let h = widget.size ? widget.size.h : 1

				let x = +this.layout.length === 0 ? 0 : ((this.layout[+this.layout.length - 1].x + this.layout[+this.layout.length - 1].w) > 8 || (this.layout[+this.layout.length - 1].x + this.layout[+this.layout.length - 1].w + w) > 8 ? 0 : (this.layout[+this.layout.length - 1].x + this.layout[+this.layout.length - 1].w))

				let y = 0

				this.layout.push({
					x: x,
					y: y,
					w: w,
					h: h,
					i: +this.layout.length + 1,
					id: widget.id
				})
			}
			localStorage.setItem('widgets_layout', JSON.stringify(this.layout))
			try {
				let res = await ky.post('/admin/widgets-get-all-db', {json: {widgets: this.widgets}}).json()
				this.block = !this.block
				console.log(res)
			} catch (e) {
				console.log(e)
			}
			this.keyRender++
			setTimeout(() => {
				document.getElementById('widgets').style.width = '100%'
			}, 100)
		},
		async removeFromLayout(id) {
			this.block = !this.block
			this.layout = this.layout.filter(e => e.id !== id)
			let item = this.widgets.find(e => e.id === id)
			if (item) item.added = !item.added
			localStorage.setItem('widgets_layout', JSON.stringify(this.layout))
			try {
				let res = await ky.post('/admin/widgets-get-all-db', {json: {widgets: this.widgets}}).json()
				this.block = !this.block
				console.log(res)
			} catch (e) {
				console.log(e)
			}
		},
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
			if (this.draggable) this.editSwitch()
		},
		closePopup() {
			this.modalCount--
		},
		move(itemIdx) {
		},
		moved(itemIdx) {
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
