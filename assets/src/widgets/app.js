import {createApp} from 'vue';
import App from './App.vue'
import GridLayout from 'vue3-drr-grid-layout'

import ky from "ky";

window.widgetsInit = {}

const localLayout = JSON.parse(localStorage.getItem('widgets_layout'))


async function setLayout() {
	const res = await ky.get('/admin/widgets-get-all').json()
	let widgets = res.widgets
	let layout = []

	for (let widgetsKey in widgets) {
		let widget = widgets[widgetsKey]

		let w = widget.size ? widget.size.w : 1
		let h = widget.size ? widget.size.h : 1

		let x = +widgetsKey === 0 ? 0 : ((layout[+widgetsKey - 1].x + layout[+widgetsKey - 1].w) > 8 || (layout[+widgetsKey - 1].x + layout[+widgetsKey - 1].w + w) > 8 ? 0 : (layout[+widgetsKey - 1].x + layout[+widgetsKey - 1].w))

		layout.push({
			x: x,
			y: 0,
			w: w,
			h: h,
			i: +widgetsKey,
			id: `${widget.id}_${widgetsKey}`
		})

	}
	return {layout: layout, widgets: widgets}
}

setLayout().then(res => {
	let winInnerWidth = +localStorage.getItem('win_innerWidth')
	let layout = null
	if (window.innerWidth === winInnerWidth && localLayout !== null) {
		layout = localLayout
	} else {
		layout = res.layout
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
