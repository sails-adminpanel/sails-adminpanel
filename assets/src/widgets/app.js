import {createApp} from 'vue';
import App from './App.vue'
import GridLayout from 'vue3-drr-grid-layout'

import ky from "ky";

window.widgetsInit = {}

const localLayout = JSON.parse(localStorage.getItem('widgets_layout'))
let {widgetsDB} = await ky.get('/admin/widgets-get-all-db').json()

widgetsDB = widgetsDB ?? []

//console.log(widgetsDB)
async function init() {
	const res = await ky.get('/admin/widgets-get-all').json()
	let widgets = res.widgets

	let initWidgets = []


	for (let widgetsKey in widgets) {
		let widget = widgets[widgetsKey]
		let findItem = null

		if (widgetsDB.length) {
			findItem = widgetsDB.find(e => e.id === widget.id)
		}
		if (findItem) {
			initWidgets.push(findItem)
		} else {
			initWidgets.push(widget)
		}
	}
	return {widgets: initWidgets}
}

init().then(res => {
	let layout = []
	let filtered = res.widgets.filter(e => e.added)

	if (localLayout !== null) {
		for (let resKey in filtered) {
			let widget = filtered[resKey]
			let findItem = localLayout.find(e => e.id === widget.id)

			if (findItem) {
				layout.push(findItem)
			} else {
				let w = widget.size ? widget.size.w : 1
				let h = widget.size ? widget.size.h : 1

				let x = +resKey === 0 ? 0 : ((layout[+resKey - 1].x + layout[+resKey - 1].w) > 8 || (layout[+resKey - 1].x + layout[+resKey - 1].w + w) > 8 ? 0 : (layout[+resKey - 1].x + layout[+resKey - 1].w))

				layout.push({
					x: x,
					y: 0,
					w: w,
					h: h,
					i: +resKey,
					id: widget.id
				})
			}
		}

	} else {
		// creating a layout from the added widgets
		for (let resKey in filtered) {
			let widget = filtered[resKey]
			let w = widget.size ? widget.size.w : 1
			let h = widget.size ? widget.size.h : 1

			let x = +resKey === 0 ? 0 : ((layout[+resKey - 1].x + layout[+resKey - 1].w) > 8 || (layout[+resKey - 1].x + layout[+resKey - 1].w + w) > 8 ? 0 : (layout[+resKey - 1].x + layout[+resKey - 1].w))

			layout.push({
				x: x,
				y: 0,
				w: w,
				h: h,
				i: +resKey,
				id: widget.id
			})
		}
	}

	window.widgetsInit = {
		layout: layout,
		widgets: res.widgets
	}
	let app = createApp(App);
	app.config.devtools = true;
	app.use(GridLayout)
	app.mount('#widgets');

})
