<template>
	<div class="admin-widgets__wrapper" :class="getClass"
		 :style="backgroundColor"
		 @click="switching"
		 :ref="`admin-widget_${i}`"
	>
		<div class="admin-widgets__title">
			<div>
				<span class="admin-widgets__name">{{ name }}</span>
				<p class="admin-widgets__desc">{{ description }}</p>
			</div>
			<div class="admin-widgets__bottom">
				<div v-if="type === 'info'">
					{{ info }}
				</div>
				<div v-if="type === 'switcher'">
					<span v-if="state" class="admin-widgets__state">
						ON
					</span>
					<span v-else class="admin-widgets__state">
						OFF
					</span>
				</div>
				<span class="admin-widgets__icon">
					<i :class="`las la-${icon}`"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import {defineComponent} from "vue";
import ky from "ky";

export default defineComponent({
	name: 'Widget',
	props: ['widgets', 'i', 'draggable'],
	data() {
		return {
			name: null,
			info: null,
			description: null,
			icon: null,
			backgroundColor: null,
			type: null,
			state: null
		}
	},
	mounted() {
		this.getBackground()
		this.getName()
		this.getDescription()
		this.getIcon()
		this.getType()
		if(this.type === 'info') this.getInfo()
		if(this.type === 'switcher') this.getState()
	},
	computed: {
		getClass(){
			if(this.type === 'info' && !this.draggable){
				return 'admin-widgets__wrapper--info'
			} else if(this.type === 'switcher' && !this.draggable){
				return 'admin-widgets__wrapper--switcher'
			}
		}
	},
	methods: {
		getType(){
			this.type = this.widgets[this.i].type
		},
		async getInfo(){
			let api = this.widgets[this.i].api
			this.info = await ky(api).text()
		},
		async getState(){
			let api = this.widgets[this.i].api
			let res = await ky(api).json()
			this.state = res.state
		},
		async switching(){
			if(this.type !== 'switcher' || this.draggable) return

			let widget = this.$refs[`admin-widget_${this.i}`]

			widget.classList.add('admin-widgets__wrapper--switching')

			let api = this.widgets[this.i].api
			let res = await ky.post(api).json()
			this.state = res.state

			widget.classList.remove('admin-widgets__wrapper--switching')
		},
		getName() {
			this.name = this.widgets[this.i].name
		},
		getDescription() {
			this.description = this.widgets[this.i].description
		},
		getBackground() {
			let bg = this.widgets[this.i].backgroundCSS ?? 'rgba(45, 121, 210, 0.6)'
			this.backgroundColor = `background-color: ${bg}`
		},
		getIcon() {
			this.icon = this.widgets[this.i].icon ?? 'box'
		},
	}
})
</script>

<style scoped>

</style>
