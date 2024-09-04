<template>
	<div class="add-widgets-pop-up" :class="block ? 'add-widgets-pop-up__block' : ''">
		<div class="add-widgets-pop-up__head">
			<h2>Widget Settings</h2>
		</div>
		<div class="add-widgets-pop-up__head-nav">
			<div class="add-widgets-pop-up__nav">
				<div class="add-widgets-pop-up__nav-item" :class="filter ? '' : 'add-widgets-pop-up__nav-item--active'"
					 @click="filter = null">
					<span>All</span>
				</div>
				<div class="add-widgets-pop-up__nav-item"
					 :class="filter === nav.type ? 'add-widgets-pop-up__nav-item--active' : ''"
					 v-for="nav in head" @click="filter = nav.type">
					<span>{{ nav.title }}</span>
				</div>
			</div>
			<input class="text-input" type="search" name="search" id="search" v-model="search">
		</div>
		<div class="add-widgets-pop-up__body">
			<div class="add-widgets-pop-up__widgets">
				<div class="add-widgets-pop-up__widgets-items" v-for="widget in filteredWidgets" :key="widget.title">
					<div class="add-widgets-pop-up__widgets-item">
						<h3>{{ widget.title }}</h3>
						<div class="add-widgets-pop-up__widgets-array">
							<div class="add-widgets-pop-up__widgets-array-item" v-for="item in widget.items"
								 :key="item.id">
								<div class="add-widgets-pop-up__widgets-array-item-top">
											<span class="add-widgets-pop-up__widgets-array-item-icon"><i
												:class="'las la-' + (item.icon ?? 'box')"></i></span>
									<div class="add-widgets-pop-up__widgets-array-item-title">
										{{ item.name }}
									</div>
								</div>
								<div class="add-widgets-pop-up__widgets-array-item-bottom">
									<div class="add-widgets-pop-up__widgets-array-item-btn" v-if="!item.added"
										 @click="addWidget(item.id)">
										Show
									</div>
									<div class="add-widgets-pop-up__widgets-array-item-btn-added" v-else
										 @click="addWidget(item.id)">
										Hide
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "AddWidgets",
	props: ['initWidgets', 'block'],
	emits: ['addWidgets'],
	data() {
		return {
			widgets: {
				switchers: {
					items: [],
					title: null
				},
				info: {
					items: [],
					title: null
				},
				actions: {
					items: [],
					title: null
				},
				links: {
					items: [],
					title: null
				},
				customs: {
					items: [],
					title: null
				}
			},
			head: [],
			selectedWidgets: [],
			filter: null,
			search: ''
		}
	},
	computed: {
		filteredWidgets() {
			if (this.filter && this.search.length < 3) {
				const filtered = Object.keys(this.widgets).filter(key => key === this.filter)
				return [this.widgets[filtered]]
			} else if (this.search.length >= 3) {
				this.filter = null
				let new_widgets = {
					search: {
						items: [],
						title: 'Search',
					}
				}
				for (const key of Object.keys(this.widgets)) {
					let items = this.widgets[key].items.filter(e => e.name.toLowerCase().indexOf(this.search) >= 0)
					new_widgets.search.items = [...new_widgets.search.items, ...items]
				}
				return new_widgets
			} else {
				return this.widgets
			}
		}
	},
	created() {
		console.log(this.initWidgets)
		for (const widget of this.initWidgets) {
			if (widget.type === 'switcher') {
				this.widgets.switchers.items.push(widget)
				if (this.head.find(e => e.type === 'switchers')) continue
				this.widgets.switchers.title = 'Switcher'
				this.head.push({
					type: 'switchers',
					title: 'Switcher'
				})
			}
			if (widget.type === 'info') {
				this.widgets.info.items.push(widget)
				if (this.head.find(e => e.type === 'info')) continue
				this.widgets.info.title = 'Info'
				this.head.push({
					type: 'info',
					title: 'Info'
				})
			}
			if (widget.type === 'action') {
				this.widgets.actions.items.push(widget)
				if (this.head.find(e => e.type === 'actions')) continue
				this.widgets.actions.title = 'Actions'
				this.head.push({
					type: 'actions',
					title: 'Actions'
				})
			}
			if (widget.type === 'link') {
				this.widgets.links.items.push(widget)
				if (this.head.find(e => e.type === 'links')) continue
				this.widgets.links.title = 'Links'
				this.head.push({
					type: 'links',
					title: 'Fast links'
				})
			}
			if (widget.type === 'custom') {
				this.widgets.customs.items.push(widget)
				if (this.head.find(e => e.type === 'custom')) continue
				this.widgets.customs.title = 'Customs'
				this.head.push({
					type: 'custom',
					title: 'Custom'
				})
			}
		}
	},
	methods: {
		addWidget(id) {
			for (const key of Object.keys(this.widgets)) {
				let item = this.widgets[key].items.find(e => e.id === id)
				if (item) item.added = !item.added
			}
			this.$emit('addWidgets', id)
		}
	},

}
</script>

<style scoped>


</style>
