<template>
	<div @drop.prevent="onDrop" class="drop-zone" @click="fileInput.click()">
		<span class="text-sm text-[#C6BBBB]">dropzone</span>
	</div>
	<input type="file" name="" id="" @input="onLoad" ref="fileInput" hidden="hidden" multiple>
</template>

<script setup>
import {inject, onMounted, onUnmounted, ref} from 'vue'

const fileInput = ref(null)
const uploadUrl = inject('uploadUrl')

async function onDrop(e) {
	for (const file of e.dataTransfer.files) {
		await upload(file)
	}
}

async function onLoad(e) {
	console.log(e.target.files)
	for (const file of e.target.files) {
		await upload(file)
	}
}

async function upload(file) {
	let form = new FormData()
	form.append('name', file.name)
	form.append('file', file)
	let res = await ky.post(uploadUrl, {body: form}).json()
	console.log(res)
}

function preventDefaults(e) {
	e.preventDefault()
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop']

onMounted(() => {
	events.forEach((eventName) => {
		document.body.addEventListener(eventName, preventDefaults)
	})
})

onUnmounted(() => {
	events.forEach((eventName) => {
		document.body.removeEventListener(eventName, preventDefaults)
	})
})
</script>
<style scoped>
.drop-zone {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 106px;
	width: 100%;
	background-color: #F0F2FF;
	cursor: pointer;
	background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='11' ry='11' stroke='%23A09999FF' stroke-width='7' stroke-dasharray='9' stroke-dashoffset='12' stroke-linecap='butt'/%3e%3c/svg%3e");
	border-radius: 11px;
	transition: all 0.2s ease-in-out;
}

.drop-zone:hover {
	background-color: #e1e5ff;
}
</style>
