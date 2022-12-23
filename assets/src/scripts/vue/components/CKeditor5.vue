<template>
	<ckeditor :editor="editor" @ready="onReady" :config="editorConfig"></ckeditor>
</template>

<script>
	import { defineComponent } from "@vue/runtime-core";
	import CKEditor from "@ckeditor/ckeditor5-vue";
	import ClassicEditor from "@ckeditor/ckeditor5-build-decoupled-document";
	export default defineComponent({
		components: {
			ckeditor: CKEditor.component,
		},
		data() {
			return {
				editorConfig: {
					toolbar: {
						items: [
							"heading",
							"|",
							"fontSize",
							"fontFamily",
							"|",
							"fontColor",
							"fontBackgroundColor",
							"|",
							"bold",
							"italic",
							"underline",
							"strikethrough",
							"|",
							"alignment",
							"|",
							"numberedList",
							"bulletedList",
							"|",
							"outdent",
							"indent",
							"|",
							"todoList",
							"link",
							"blockQuote",
							"imageUpload",
							"insertTable",
							"mediaEmbed",
							"|",
							"undo",
							"redo",
						],
					},
					language: "ru",
					image: {
						toolbar: [
							"imageTextAlternative",
							"imageStyle:alignLeft",
							"imageStyle:alignRight",
							"imageStyle:alignCenter",
						],
					},
					table: {
						contentToolbar: [
							"tableColumn",
							"tableRow",
							"mergeTableCells",
							"tableCellProperties",
							"tableProperties",
						],
					},
				},
				editor: ClassicEditor,
			};
		},
		methods: {
			onReady(editor) {
				editor.ui
					.getEditableElement()
					.parentElement.insertBefore(
						editor.ui.view.toolbar.element,
						editor.ui.getEditableElement()
					);
				editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
					return new UploadAdapter(loader);
				};
			},
		},
	});
	class UploadAdapter {
		constructor(loader) {
			this.loader = loader;
		}

		async upload() {
			const data = new FormData();
			data.append("image", await this.loader.file);

			const res = await axios.post("/api/image", data);

			// Backstage returns data:
			// {"code":0,"msg":"success","data":{"url":"/upload/struts2.jpeg"}}

			// Method Returns data format: {Default: "URL"}
			return {
				default: res.data.data.url,
			};
		}
	}
</script>

<style>
	.ck.ck-content {
		border: 1px solid #ced4da;
		border-top: transparent;
		min-height: 200px;
		padding: 20px;
	}
</style>
