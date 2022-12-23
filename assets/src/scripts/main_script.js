import $ from 'jquery'
import DataTable from 'datatables.net/js/jquery.dataTables'
import Dropzone from '../fileuploader/js/dropzone'
import { FileUploader } from '../fileuploader/js/fileupload'
import { EditNavigation } from '../navigation/js/editNavigation'
import { EditSchedule } from '../schedule/js/editSchedule'
import SelectPure from 'select-pure'
import Handsontable from 'handsontable';
import L from 'leaflet'
import 'leaflet-draw'
import { GeoJsonEditor } from '../geojson/geojson'

import 'jquery-ui-dist/jquery-ui.js'

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


addEventListener('DOMContentLoaded', function(){
	/* burger menu */
$('.header__menu').on("click", function () {
    $(this).toggleClass('header__menu--active');
    $('.sidenav-panel').toggleClass('sidenav-panel--active')
})
/* --- burger menu end --- */

$('.nav-label').on("click", function () {
    $(this).find('.fas').toggleClass('active-arrow');
})

var url = window.location.pathname,
    urlRegExp = new RegExp(url.replace(/\/$/, '') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
// now grab every link from the navigation
$('a').each(function () {
    // and test its normalized href against the url pathname regexp
    if (urlRegExp.test(this.href.replace(/\/$/, ''))) {
        $(this).addClass('active');
    }
});
})


