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
import { AdminPopUp } from '../pop-up/admin-pop-up'

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
window.AdminPopUp = AdminPopUp

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
	stylesheet.innerText = `.content-resize { grid-template-columns: 252px 8px 1fr; }`
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


	// active elem aside
	const url = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
	$('.aside a').each(function () {
		let link = this.href.substring(this.href.lastIndexOf('/') + 1)

		if (url === link && window.location.href.indexOf('form') >= 0) {
			$(this).closest('.menu__item ').addClass('bg-white dark:bg-blue-700')
		} else if (url === link) {
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
		if (submitButton && key === "hasError") {
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
