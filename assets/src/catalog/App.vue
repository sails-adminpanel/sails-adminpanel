<template>
	<div class="flex items-center gap-4">
		<button class="btn btn-add mb-4" @click="toolAddGroup('group')"><i
			class="las la-plus"></i><span>create group</span>
		</button>
		<button class="btn btn-add mb-4" @click="toolAddGroup('item')"><i
			class="las la-plus"></i><span>create item</span>
		</button>
	</div>
	<div class="custom-catalog__container" v-show="nodes.length">
		<sl-vue-tree-next
			v-model="nodes"
			ref="slVueTreeRef"
			id="slVueTree_id"
			:allow-multiselect="true"
			@select="nodeSelected"
			@drop="nodeDropped"
			@toggle="nodeToggled"
			@nodecontextmenu="showContextMenu"
		>
			<template #title="{ node }">
                            <span class="item-icon">
                                <i class="las la-file" v-if="node.isLeaf"></i>
                                <i class="las la-folder" v-if="!node.isLeaf"></i>
                            </span>

				{{ node.title }}
			</template>

			<template #toggle="{ node }">
                            <span v-if="!node.isLeaf">
                                <i v-if="node.isExpanded" class="las la-angle-down"></i>
                                <i v-if="!node.isExpanded" class="las la-angle-up"></i>
                            </span>
			</template>

			<template #sidebar="{ node }">
                            <span class="visible-icon" @click="event => toggleVisibility(event, node)">
                                <i v-if="!node.data || node.data.visible !== false" class="las la-eye"></i>
                                <i v-if="node.data && node.data.visible === false" class="las la-eye-slash"></i>
                            </span>
			</template>

			<template #draginfo="draginfo"> {{ selectedNodesTitle }}</template>
		</sl-vue-tree-next>
		<div class="json-preview">
			<h2>JSON Preview</h2>
			<pre>{{ nodes }}</pre>
		</div>
	</div>
	<div class="contextmenu" ref="contextmenu" id="contextmenu" v-show="contextMenuIsVisible">
		<ul class="custom-catalog__actions-items">
			<li>
				New Folder
			</li>
		</ul>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="parentPopUp">
		<div v-if="isTollAdd && index === 1" class="custom-catalog__form">
			<SelectItem :initItemsGroup="ItemsGroup" :initItemsItem="ItemsItem" :isGroupRootAdd="isGroupRootAdd"
						:isItemRootAdd="isItemRootAdd" @createNewFolder="createNewFolder"
						@createNewItem="initCreateNewItem"/>
		</div>
		<div v-if="isFolder && index === 2" class="custom-catalog__form">
			<folder @save-folder="saveFolder" :html="HTML"/>
		</div>
		<div v-if="isItem && index === 2" class="custom-catalog__form">
			<MiddlewareItem :selectedItem="selectedItem" :getHTMLoading="getHTMLoading" @createNewItem="createNewItem"/>
		</div>
		<div v-if="isItem && index === 3" class="custom-catalog__form">
			<Item @save-item="saveItem" :html="HTML" :itemType="selectedItem"/>
		</div>
	</pop-up>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive} from 'vue'
import PopUp from "./PopUp.vue";
import Folder from "./Components/Folder.vue";
import Item from "./Components/Item.vue";
import SelectItem from "./Components/SelectItem.vue";
import MiddlewareItem from "./Components/MiddlewareItem.vue";
import ky from "ky";

let nodes = ref([])

let contextMenuIsVisible = ref(false)
let selectedNodesTitle = ref('')
let selectedNodesType = ref('')
let slVueTreeRef = ref(null)
let contextmenu = ref(null)
let modalCount = ref(0)
let isFolder = ref(false)
let isItem = ref(false)
let parentPopUp = ref(null)
let newFolder = ref(false)
let HTML = ref('')
let ItemsGroup = ref([])
let ItemsItem = ref([])
let selectedGroup = ref([])
let selectedItem = ref('')
let isTollAdd = ref(false)
let isItemRootAdd = ref(false)
let isGroupRootAdd = ref(false)
let getHTMLoading = ref(false)

onMounted(async () => {
	document.addEventListener('click', function (e) {
		const contextmenu = document.getElementById('contextmenu')
		if (!e.composedPath().includes(contextmenu)) {
			contextMenuIsVisible.value = false
		}
		const slVueTree_id = document.getElementById('slVueTree_id')
		if (!e.composedPath().includes(slVueTree_id)) {
			contextMenuIsVisible.value = false
		}
		const nodesList = document.querySelector('.sl-vue-tree-next-nodes-list')
		if (!e.composedPath().includes(nodesList)) {
			contextMenuIsVisible.value = false
		}
	})
	getCatalog()
})

async function getCatalog() {
	let {catalog, items} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	if (items) {
		console.log(catalog, items)
		for (const catalogItem of items) {
			if (catalogItem.isGroup) {
				ItemsGroup.value.push(catalogItem)
			} else {
				ItemsItem.value.push(catalogItem)
			}
		}
		setCatalog(catalog)
	} else {
		console.log(catalog)
	}
}

async function reloadCatalog() {
	let {catalog} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	setCatalog(catalog)
}

function toolAddGroup(type) {
	modalCount.value++
	switch (type) {
		case('group'):
			isGroupRootAdd.value = true
			break
		case ('item'):
			isItemRootAdd.value = true
			break;
		default:
			break;
	}
	isTollAdd.value = true
}

function setCatalog(catalog) {
	nodes.value = catalog.nodes
}

function addFolder(isNew) {
	newFolder.value = isNew
	modalCount.value++
	isFolder.value = true
}

async function createNewFolder(isNew, value) {
	selectedGroup.value = value
	let resPost = await ky.post('', {json: {type: value, _method: 'getHTML'}}).json()
	await getHTML(resPost)
	addFolder(true)
}

async function getHTML(data) {
	if (data.type === 'html') {
		HTML.value = data.data
	} else if (data.type === 'link') {
		let resPost = await ky.get(data.data).text()
		HTML.value = resPost
	} else {
		return
	}
}

function initCreateNewItem(value) {
	selectedItem.value = value
	isItem.value = true
	modalCount.value++
}

async function createNewItem() {
	getHTMLoading.value = true
	let resPost = await ky.post('', {json: {type: selectedItem.value, _method: 'getHTML'}}).json()
	await getHTML(resPost)
	getHTMLoading.value = false
	modalCount.value++
}

function saveFolder(data) {
	if (newFolder.value) {
		createFolder(data)
	} else {
		let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
		recurciveFindAndInsert(selectedFolderPath, false, false, folderName)
	}

	slVueTreeRef.value.updateNode([0])
	closeAllPopups()
}

function closeAllPopups() {
	for (const parentPopUpElement of parentPopUp.value) {
		parentPopUpElement.closePopup()
	}
}

async function createFolder(data) {
	data.ind = nodes.value.length
	let res = await ky.post('', {json: {type: selectedGroup.value, data: data, _method: 'createItem'}}).json()
	if (res.data.ok) reloadCatalog()
}

async function createItem(data) {
	data.ind = nodes.value.length
	let res = await ky.post('', {json: {type: selectedItem.value, data: data, _method: 'createItem'}}).json()
	if (res.data.ok) reloadCatalog()
}

async function saveItem(data) {
	await createItem(data)
	// let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
	// recurciveFindAndInsert(selectedFolderPath, false, true, itemName)

	slVueTreeRef.value.updateNode([0])
	closeAllPopups()
}

function recurciveFindAndInsert(path, nodesArr, isLeaf, title) {
	let index = path.shift()
	let result = null
	if (nodesArr && nodesArr.children.length) {
		result = nodesArr.children.find((e, i) => i === index)
	} else {
		result = nodes.find((e, i) => i === index)
	}
	if (path.length) {
		recurciveFindAndInsert(path, result, isLeaf, title)
	} else {
		if (result.children) {
			result.children.push({title: title, isLeaf: isLeaf})
		} else {
			result.children = []
			result.children.push({title: title, isLeaf: isLeaf})
		}
	}

}

function toggleVisibility(event, node) {
	event.stopPropagation()
	const visible = !node.data || node.data.visible !== false
	console.log(visible)
	slVueTreeRef.value.updateNode({path: node.path, patch: {data: {visible: !visible}}})
	// lastEvent.value = `Node ${node.title} is ${visible ? 'visible' : 'invisible'} now`
}

function nodeSelected(nodes, event) {
	selectedNodesTitle.value = nodes.map((node) => node.title)[0]
	selectedNodesType.value = nodes.map((node) => node.isLeaf)[0]
}

async function nodeToggled(node, event) {
	if(slVueTreeRef.value.getNode(node.path)?.isExpanded){
		let res = await ky.post('', {json: {data: node, _method: 'getChilds'}}).json()

		for (const rNode of res.data.nodes) {
			slVueTreeRef.value.insert({
					node: node,
					placement: 'inside'
				},
				rNode
			)
		}
	} else {
		for (const child of slVueTreeRef.value.getNode(node.path).children) {
			slVueTreeRef.value.remove([child.path])
		}
	}

}

async function nodeDropped(node, position, event) {
	let tree = slVueTreeRef.value.getNode(position.node.path)
	let res = await ky.put('', {json: {data: tree, _method: 'sortOrder'}}).json()
	console.log(res)
	// lastEvent.value = `Nodes: ${nodes.map((node) => node.title).join(', ')} are dropped ${position.placement} ${position.node.title}`
}

function showContextMenu(node, event) {
	event.preventDefault()
	contextMenuIsVisible.value = true
	const $contextMenu = contextmenu.value
	$contextMenu.style.left = event.clientX + 'px'
	$contextMenu.style.top = event.clientY + 'px'
}

function removeNode() {
	contextMenuIsVisible.value = false
	const $slVueTree = slVueTreeRef.value
	const paths = $slVueTree.getSelected().map((node) => node.path)
	$slVueTree.remove(paths)
}

function closePopup() {
	switch (modalCount.value) {
		case (3):
			break;
		case(2):
			isFolder.value = false
			isItem.value = false
			break;
		case (1):
			isGroupRootAdd.value = false
			isItemRootAdd.value = false
			break;
		default:
			isFolder.value = false
			isItem.value = false
			isGroupRootAdd.value = false
			isItemRootAdd.value = false
			break;
	}

	modalCount.value--
}
</script>


<style>
.contextmenu {
	position: absolute;
	background-color: white;
	color: black;
	border-radius: 2px;
	cursor: pointer;
}

.contextmenu > div {
	padding: 10px;
}

.contextmenu > div:hover {
	background-color: rgba(100, 100, 255, 0.5);
}

.last-event {
	color: white;
	background-color: rgba(100, 100, 255, 0.5);
	padding: 10px;
	border-radius: 2px;
}

.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
