import $ from 'jquery'
import DataTable from 'datatables.net/js/jquery.dataTables'
import Dropzone from '../fileuploader/js/dropzone'
import {FileUploader} from '../fileuploader/js/fileupload'
import {EditNavigation} from '../navigation/js/editNavigation'
import {EditSchedule} from '../schedule/js/editSchedule'
import SelectPure from 'select-pure'
import Handsontable from 'handsontable';
import L from 'leaflet'
import 'leaflet-draw'
import {GeoJsonEditor} from '../geojson/geojson'

import 'jquery-ui-dist/jquery-ui.js'

import {register} from 'swiper/element/bundle';

// register Swiper custom elements
register();

window.jQuery = window.$ = $
window.Dropzone = Dropzone
window.DataTable = DataTable
window.FileUploader = FileUploader
window.EditNavigation = EditNavigation
window.EditSchedule = EditSchedule
window.SelectPure = SelectPure
window.Handsontable = Handsontable
window.L = L
window.GeoJsonEditor = GeoJsonEditor

import('../navigation/js/jquery-sortable-lists.min.js')
import('bootstrap/dist/js/bootstrap.js')

//dark-mode
const dark = localStorage.getItem('__dark-mode')
const html = document.querySelector('html')

if (dark === '1') {
	html.classList.add('dark')
}

//aside resize
const left_offset = localStorage.getItem('__left_offset')

let stylesheet = document.createElement("style");
stylesheet.type = 'text/css';

if (left_offset) {
	stylesheet.innerText = `.content-resize { grid-template-columns: ${left_offset}px 8px 1fr; }`
	//stylesheet.replaceSync(`.content-resize { grid-template-columns: ${left_offset}px 8px 1fr; }`)
} else {
	stylesheet.innerText =`.content-resize { grid-template-columns: 252px 8px 1fr; }`
	//stylesheet.replaceSync(`.content-resize { grid-template-columns: 252px 8px 1fr; }`)
}
document.head.appendChild(stylesheet);
//document.adoptedStyleSheets = [stylesheet];


addEventListener('DOMContentLoaded', function () {
	// aside menu
	$(document).on('click', '.menu__has-sub', function () {
		$(this).toggleClass('menu__has-sub--active')
		$(this).closest('.menu__item').find('.menu__sub-list').slideToggle()
	})
	//aside resize
	const content_resize = document.querySelector('.content-resize')
	const body = $('body');
	$('.left-resize').on('mousedown', function () {
		$('.wrapper').on('mousemove', function (e) {
			if ($(window).width() / 2 >= e.pageX && e.pageX >= 252) {
				localStorage.setItem('__left_offset', e.pageX)
				content_resize.setAttribute('style', `grid-template-columns: ${e.pageX}px 8px 1fr`)
				body.addClass('user-select-none')
			}
		})
		$('html').on('mouseup', function () {
			$('.wrapper').unbind('mousemove');
			body.removeClass('user-select-none')
		});
	})
	$(window).on('resize', function () {
		let aside = document.querySelector('.aside')
		if (aside.offsetWidth > $(window).width() / 2) {
			content_resize.setAttribute('style', `grid-template-columns: 252px 8px 1fr`)
			localStorage.setItem('__left_offset', '252')
		}
	})

	//mobile-menu
	$(document).on('click', '.burger', function () {
		$(this).toggleClass('burger--active')
		$('.aside').toggleClass('aside--active')
		$('body').toggleClass('body-hidden')
	})

	//dark-mode toggle
	$(document).on('click', '.dark-mode', function () {
		if (localStorage.getItem('__dark-mode') === '0' || !localStorage.getItem('__dark-mode')) {
			localStorage.setItem('__dark-mode', '1')
		} else {
			localStorage.setItem('__dark-mode', '0')
		}
		$('html').toggleClass('dark')
	})


	var url = window.location.pathname,
		urlRegExp = new RegExp(url.replace(/\/$/, '') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
// now grab every link from the navigation
	$('.aside a').each(function () {
		// and test its normalized href against the url pathname regexp
		if (urlRegExp.test(this.href.replace(/\/$/, ''))) {
			$(this).addClass('active');
		}
	});
})

const formStateProx = {
	hasError: false
};
window.formState = new Proxy(formStateProx, {
	set: function (target, key, value) {
		let submitButton = document.getElementById("submit");
		let text = document.getElementById('error-btn-submit-text')
		if(submitButton && key === "hasError") {
			if (value === true) {
				text.setAttribute('style', 'display:block');
				submitButton.setAttribute("disabled", true);
			} else {
				text.setAttribute('style', 'display:none');
				submitButton.removeAttribute("disabled");
			}
		}
		target[key] = value;
		return true;
	}
});



function checkInitSubmitFormStatus() {
	let submitButton = document.getElementById("submit");
	if(formState.hasError) {
		submitButton.setAttribute("disabled", true);
	}
}
checkInitSubmitFormStatus();

function submitForm() {
	// Assign JSONEditor value to form textarea
	for (var id in jsonEditor) {
		try {
			var json = jsonEditor[id].get();
			$('#form-' + id).val(JSON.stringify(json));
		} catch (e) {
			alert('JSON is invalid.');
			$('#form-' + id).show().focus().hide();
			jsonEditor[id].focus();
			return false;
		}
	};

	for (var id in tables) {
		try {
			var schema = tables[id].getSchema();
			var table = tables[id].getData();
			table = table.filter(item => {
				return !([...new Set(item)].length === 1 && [...new Set(item)][0] === null);
			});
			if (schema && Object.keys(schema).length) {
				table = table.map((item) => {
					var newItem = {};
					var keys = Object.keys(schema);
					for (let i = 0; i < keys.length; i++) {
						newItem[keys[i]] = item[i];
					}
					return newItem;
				});
			} else {
				table = table.map((item) => {
					return [null].concat(item);
				});
			}
			$('#form-' + id).val(JSON.stringify(table));
		} catch (e) {
			alert('Table is invalid!');
			return false;
		}
	}
	document.getElementById('form').submit();
}


