<template>
		<div class="admin-widgets__wrapper" :class="getClass"
			 :style="backgroundColor"
			 @click="widgetAction"
			 :ref="`admin-widget_${ID}`"
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
			<div class="admin-widgets__close" @click="removeItem(ID)">
				<i class="las la-times"></i>
			</div>
		</div>
</template>

<script>
import {defineComponent} from "vue";
import ky from "ky";

export default defineComponent({
	name: 'Widget',
	props: ['widgets', 'draggable', 'ID'],
	emits: ['removeItem'],
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
		if (this.type === 'info') this.getInfo()
		if (this.type === 'switcher') this.getState()
	},
	computed: {
		getClass() {
			if (this.type === 'info' && !this.draggable) {
				return 'admin-widgets__wrapper--info'
			} else if (this.type === 'switcher' || this.type === 'action' && !this.draggable) {
				return 'admin-widgets__wrapper--switcher'
			} else{
				return 'admin-widgets__wrapper--link'
			}
		}
	},
	methods: {
		removeItem(ID) {
			this.$emit('removeItem', ID)
		},
		getType() {
			this.type = this.widgets.find(e => e.id === this.ID).type
		},
		async getInfo() {
			let api = this.widgets.find(e => e.id === this.ID).api
			this.info = await ky(api).text()
		},
		async getState() {
			let api = this.widgets.find(e => e.id === this.ID).api
			let res = await ky(api).json()
			this.state = res.state
		},
		async widgetAction() {
			if (this.type === 'info' || this.draggable) return

			if( this.type === 'link'){
				document.location.href = this.widgets.find(e => e.id === this.ID).link
				return
			}


			let widget = this.$refs[`admin-widget_${this.ID}`]

			widget.classList.add('admin-widgets__wrapper--switching')

			let api = this.widgets.find(e => e.id === this.ID).api
			switch (this.type) {
				case ('switcher'):
					try {
						let res = await ky.post(api).json()
						this.state = res.state
					} catch (e) {
						console.log(e)
					}
					break;
				case ('action'):
					try {
						let res = await ky.post(api).json()
						console.log(res)
					} catch (e) {
						console.log(e)
					}
					break;
				default:
					return;
			}
			widget.classList.remove('admin-widgets__wrapper--switching')
		},
		getName() {
			this.name = this.widgets.find(e => e.id === this.ID).name
		},
		getDescription() {
			this.description = this.widgets.find(e => e.id === this.ID).description
		},
		getBackground() {
			let bg = this.widgets.find(e => e.id === this.ID).backgroundCSS ?? 'rgba(45, 121, 210, 0.6)'
			this.backgroundColor = `background-color: ${bg}`
		},
		getIcon() {
			this.icon = this.widgets.find(e => e.id === this.ID).icon ?? 'box'
		},
	}
})
</script>

<style scoped>

</style>
