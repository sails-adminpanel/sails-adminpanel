<template>
	<div class="flex items-center gap-4">
		<button class="btn btn-add" @click="toolAddGroup('group')"><i
			class="las la-plus"></i><span>create group</span>
		</button>
		<button class="btn btn-add" @click="toolAddGroup('item')"><i
			class="las la-plus"></i><span>create item</span>
		</button>
		<div class="admin-panel__widget">
			<div class="widget_narrow ">
				<input class="text-input w-full input-search" type="text" placeholder="Search" value="" @input="search"
					   v-model="searchText"/>
			</div>
		</div>
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

				<span :class="node.data.searched ? 'search' : ''">{{ node.title }}</span>
			</template>

			<template #toggle="{ node }">
                            <span v-if="!node.isLeaf">
                                <i v-if="node.isExpanded" class="las la-angle-down"></i>
                                <i v-if="!node.isExpanded" class="las la-angle-up"></i>
                            </span>
			</template>

			<!--			<template #sidebar="{ node }">-->
			<!--                            <span class="visible-icon" @click="event => toggleVisibility(event, node)">-->
			<!--                                <i v-if="!node.data || node.data.visible !== false" class="las la-eye"></i>-->
			<!--                                <i v-if="node.data && node.data.visible === false" class="las la-eye-slash"></i>-->
			<!--                            </span>-->
			<!--			</template>-->

			<template #draginfo="draginfo"> {{ selectedNodesTitle }}</template>
		</sl-vue-tree-next>
		<div class="json-preview">
			<h2>JSON Preview</h2>
			<pre>{{ nodes }}</pre>
		</div>
	</div>
	<div class="contextmenu" ref="contextmenu" id="contextmenu" v-show="contextMenuIsVisible">
		<ul class="custom-catalog__actions-items">
			<li v-for="action in actions" @click="initAction(action.id)">
				{{ action.name }}
			</li>
		</ul>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="parentPopUp">
		<div v-if="isTollAdd && index === 1" class="custom-catalog__form">
			<SelectItem :initItemsGroup="ItemsGroup" :initItemsItem="ItemsItem" :isGroupRootAdd="isGroupRootAdd"
						:isItemRootAdd="isItemRootAdd" @createNewFolder="createNewFolder"
						@createNewItem="createNewItem"/>
		</div>
		<div v-if="isFolder && index === 2" class="custom-catalog__form">
			<folder @save-folder="saveFolder" :html="HTML"/>
		</div>
		<div v-if="isItem && index === 2" class="custom-catalog__form">
			<Item @save-item="saveItem" :html="HTML"/>
		</div>
		<div v-if="isActionPopUp && index === 1">
			<ActionPopUp @update-folder="updateFolder" :html="HTML" @update-item="updateItem"
						 :itemType="selectedNode.data.type"
						 :isItem="selectedNode.isLeaf"/>
		</div>
	</pop-up>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive, watch} from 'vue'
import PopUp from "./PopUp.vue";
import Folder from "./Components/Folder.vue";
import Item from "./Components/Item.vue";
import SelectItem from "./Components/SelectItem.vue";
import MiddlewareItem from "./Components/MiddlewareItem.vue";
import ActionPopUp from "./Components/ActionPopUp.vue";
import ky from "ky";
import debounce from "lodash/debounce"

let nodes = ref([])

let contextMenuIsVisible = ref(false)
let selectedNodesTitle = ref('')
let selectedNode = ref('')
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
let actions = ref([])
let isActionPopUp = ref(false)
let searchText = ref('')

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

const search = debounce(async () => {
	if(searchText.value.length > 0) {
		await searchNodes()
	} else {
		getCatalog()
	}
}, 500)

async function searchNodes() {
	let res = await ky.post('', {json: {s: searchText.value, _method: 'search'}}).json()
	if (res.data) {
		for (const node of res.data) {
			insertFoundNodes(node)
		}
	}
}

function insertFoundNodes(node) {
	// let resNode = nodes.value.find(ENode => ENode.data.id === node.data.id)
	nodes.value = nodes.value.map(ENode => ENode.data.id === node.data.id ? node : ENode)
}

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

async function createNewItem(value) {
	getHTMLoading.value = true
	let resPost = await ky.post('', {json: {type: value, _method: 'getHTML'}}).json()
	await getHTML(resPost)
	getHTMLoading.value = false
	isItem.value = true
	modalCount.value++
}

function saveFolder(data) {
	if (newFolder.value) {
		createFolder(data)
	} else {
		// let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
		// recurciveFindAndInsert(selectedFolderPath, false, false, folderName)
	}

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
	if (res.data.node) {
		nodes.value.push(res.data.node)
	}
}

async function updateFolder(data) {
	let res = await ky.put('', {
		json: {
			type: selectedNode.value.data.type,
			data: data,
			id: selectedNode.value.data.id,
			_method: 'updateItem'
		}
	}).json()
	if (res.data.ok) {
		closeAllPopups()
		reloadCatalog()
	}
}

async function addCreatedItem(id) {
	let data = {id: id, isNew: false, ind: nodes.value.length}
	await createItem(data)
	closeAllPopups()
}

async function createItem(data) {
	data.ind = nodes.value.length
	let res = await ky.post('', {json: {type: selectedItem.value, data: data, _method: 'createItem'}}).json()
	if (res.data.node) {
		nodes.value.push(res.data.node)
	}
}

async function updateItem(data) {
	let res = await ky.put('', {
		json: {
			type: selectedNode.value.data.type,
			data: data,
			id: selectedNode.value.data.id,
			_method: 'updateItem'
		}
	}).json()
	if (res.data.ok) {
		closeAllPopups()
		reloadCatalog()
	}
}

async function saveItem(data) {
	data.isNew = true
	await createItem(data)
	// let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
	// recurciveFindAndInsert(selectedFolderPath, false, true, itemName)

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
	selectedNode.value = nodes[0]
}

async function nodeToggled(node, event) {
	if (!node.isExpanded) getChilds(node)
}

function recursiveSetChilds(node, Dnodes, rNodes) {
	let arr = Dnodes === null ? nodes.value : Dnodes
	for (let valueElement of arr) {
		if (valueElement.data.id === node.data.id) {
			// console.log(valueElement.children)
			// return
			valueElement.children = []
			for (const rNode of rNodes) {
				valueElement.children.push(rNode)
			}
		} else {
			if (valueElement.children?.length > 0) {
				recursiveSetChilds(node, valueElement.children, rNodes)
			}
		}
	}
}

async function getChilds(node) {
	let res = await ky.post('', {json: {data: node, _method: 'getChilds'}}).json()
	recursiveSetChilds(node, null, res.data)
}

async function nodeDropped(Dnode, position, event) {
	let reqNode = Dnode[0],
		reqParent = null
	slVueTreeRef.value.traverse((node, nodeModel, siblings) => {
		switch (position.placement) {
			case 'inside':
				if (node.data.id === position.node.data.id) {
					reqParent = node
					return false
				}
			case 'after':
			case 'before':
				if (node.data.id === position.node.data.id) {
					slVueTreeRef.value.traverse((Tnode, TnodeModel, Tsiblings) => {
						if (Tnode.data.id === node.data.parentId) {
							reqParent = Tnode
							return false
						}
					})
				}
		}
	})
	if (reqParent === null) {
		reqParent = {
			children: [],
			data: {id: 0}
		}
		slVueTreeRef.value.traverse((node, nodeModel, siblings) => {
			if (node.level === 1) reqParent.children.push(node)
		})
	}
	//console.log('Node: ', reqNode, 'parent: ', reqParent)

	let res = await ky.put('', {json: {data: {reqNode: reqNode, reqParent: reqParent}, _method: 'sortOrder'}}).json()
}


async function showContextMenu(node, event) {
	event.preventDefault()
	if (!selectedNode.value) return
	let res = await ky.post('', {
		json: {
			type: selectedNode.value.data.type,
			data: selectedNode.value.data,
			_method: 'getActions'
		}
	}).json()
	if (res.data.length) {
		actions.value = res.data
		contextMenuIsVisible.value = true
		const $contextMenu = contextmenu.value
		$contextMenu.style.left = event.clientX + 'px'
		$contextMenu.style.top = event.clientY + 'px'
	}
}

async function initAction(id) {
	let data = {
		actionID: id,
		config: selectedNode.value.data
	}
	let res = await ky.put('', {json: {type: selectedNode.value.data.type, data: data, _method: 'action'}}).json()
	if (res.data.type === 'external') {
		await getHTML(res.data.data)
		modalCount.value++
		isActionPopUp.value = true
	}

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
			isActionPopUp.value = false
			isTollAdd.value = false
			break;
		default:
			isFolder.value = false
			isItem.value = false
			isGroupRootAdd.value = false
			isItemRootAdd.value = false
			isActionPopUp.value = false
			isTollAdd.value = false
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

.input-search {
	height: 36px;
}

.sl-vue-tree-next-title:has(> span.search) {
	background: #5d5035;
}
</style>
