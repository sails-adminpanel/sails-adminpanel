<template>
	<div class="flex items-center justify-between">
		<div class="flex gap-4">
			<button class="btn btn-add" @click="toolAddGroup" :disabled="selectedNode.length > 1"><i
				class="las la-plus"></i><span>create</span>
			</button>
			<button class="btn btn-green" @click="updateItem"
					:disabled="selectedNode.length > 1 || !selectedNode.length"><span>edit</span>
			</button>
			<button class="btn btn-red" @click="deleteItem"
					:disabled="!selectedNode.length"><span>delete</span>
			</button>
			<template v-for="action in actionsTools">
				<button class="btn btn-add" @click="initAction(action.id)"><i
					:class="`las la-${action.icon}`"></i><span>{{ action.name }}</span>
				</button>
			</template>
		</div>
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
                                <i :class="`las la-${node.data.icon}`" v-if="node.isLeaf"></i>
                                <i :class="`las la-${node.data.icon}`" v-if="!node.isLeaf"></i>
                            </span>

				<span :class="node.data.marked ? 'search' : ''">{{ node.title }}</span>
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
	</div>
	<div class="contextmenu" ref="contextmenu" id="contextmenu" v-show="contextMenuIsVisible">
		<ul class="custom-catalog__actions-items">
			<li @click="toolAddGroup" :class="actionCreateClass">Create</li>
			<li @click="updateItem" :class="actionEditClass">Edit</li>
			<li @click="deleteItem" :class="actionDeleteClass">Delete</li>
			<li v-for="action in actions" @click="initAction(action.id)">
				{{ action.name }}
			</li>
		</ul>
	</div>
	<div style="display: none">
		<div ref="refSelectItem">
			<SelectItem :initItemsItem="ItemsItem" @createNewItem="createNewItem" v-if="isTollAdd"/>
		</div>
		<div ref="refItemHTML" class="custom-catalog__form">
			<ItemHTML :html="HTML" @close-all-popups="closeAllPopups" :selectedNode="selectedNode" v-if="isCreate"/>
		</div>
	</div>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed} from 'vue'
import ItemHTML from "./Components/ItemHTML.vue";
import SelectItem from "./Components/SelectItem.vue";
import ActionPopUp from "./Components/ActionPopUp.vue";
import debounce from "lodash/debounce"

let nodes = ref([])

let contextMenuIsVisible = ref(false)
let selectedNodesTitle = ref('')
let selectedNode = ref([])
let slVueTreeRef = ref(null)
let contextmenu = ref(null)
let refSelectItem = ref(null)
let refItemHTML = ref(null)
let isCreate = ref(false)
let PopupEvent = ref(null)
let HTML = ref('')
let ItemsItem = ref([])
let isTollAdd = ref(false)
let actionsTools = ref([])
let actionsContext = ref([])
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

let actionCreateClass = computed(() => {
	return selectedNode.value.length > 1 ? 'action-disabled' : ''
})

let actionEditClass = computed(() => {
	return selectedNode.value.length > 1 || !selectedNode.value.length ? 'action-disabled' : ''
})
let actionDeleteClass = computed(() => {
	return !selectedNode.value.length ? 'action-disabled' : ''
})

const search = debounce(async () => {
	if (searchText.value.length > 0) {
		await searchNodes()
	} else {
		reloadCatalog()
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
	nodes.value = nodes.value.map(ENode => ENode.data.id === node.data.id ? node : ENode)
}

async function getCatalog() {
	let {catalog, items} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	if (items) {
		// console.log(catalog, items)
		for (const catalogItem of items) {
			ItemsItem.value.push(catalogItem)
		}
		setCatalog(catalog)
	} else {
		// console.log(catalog)
	}
}

async function reloadCatalog() {
	let {catalog} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	setCatalog(catalog)
}

function toolAddGroup() {
	createPopup(refSelectItem.value)
	isTollAdd.value = true
}

function createPopup(content) {
	const popup = AdminPopUp.new()
	popup.on('open', () => {
		popup.content.appendChild(content);
	})
	popup.on('close', () => {
		switch (AdminPopUp.popups.length) {
			case 1:
				isCreate.value = false
				break
			case 0:
				isTollAdd.value = false
				isCreate.value = false
				break
		}
	})
}

async function closeAllPopups() {
	isCreate.value = false
	isTollAdd.value = false
	AdminPopUp.closeAll()
	if (PopupEvent.value === 'create') {
		if (selectedNode.value.length === 1) {
			await getChilds(selectedNode.value[0])
		} else {
			reloadCatalog()
		}
	}
	if (PopupEvent.value === 'update') {
		if (selectedNode.value[0].data.parentId === null) {
			reloadCatalog()
		} else {
			let parentNode = null
			slVueTreeRef.value.traverse((node, nodeModel, siblings) => {
				if (node.data.id === selectedNode.value[0].data.parentId) {
					parentNode = node
					return false
				}
			})
			await getChilds(parentNode)
		}
	}
}

function setCatalog(catalog) {
	nodes.value = catalog.nodes
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
	let resPost = await ky.post('', {json: {type: value, _method: 'getAddHTML'}}).json()
	await getHTML(resPost)
	PopupEvent.value = 'create'
	createPopup(refItemHTML.value)
	isCreate.value = true
}


async function updateItem() {
	let item = selectedNode.value[0]
	let resPost = await ky.post('', {json: {type: item.data.type, id: item.data.id, _method: 'getEditHTML'}}).json()
	await getHTML(resPost)
	PopupEvent.value = 'update'
	createPopup(refItemHTML.value)
	isCreate.value = true
}

async function deleteItem() {
	let res = await ky.delete('', {json: {data: selectedNode.value}}).json()
	if (res.data.ok) removeNodes()
}

function toggleVisibility(event, node) {
	event.stopPropagation()
	const visible = !node.data || node.data.visible !== false
	// console.log(visible)
	slVueTreeRef.value.updateNode({path: node.path, patch: {data: {visible: !visible}}})
	// lastEvent.value = `Node ${node.title} is ${visible ? 'visible' : 'invisible'} now`
}

function nodeSelected(nodes, event) {
	if (nodes.length === 1) {
		let node = nodes[0]
		if (node.isSelected) {
			slVueTreeRef.value.updateNode({path: node.path, patch: {isSelected: false}})
			selectedNode.value = []
		} else {
			selectedNode.value = nodes
		}
	} else {
		selectedNode.value = nodes
	}
	selectedNodesTitle.value = nodes.map((node) => node.title)[0]
	if (!selectedNode.value.length) {
		actionsTools.value = []
	} else {
		if (!actionsTools.value.length) getActionsTools()
	}
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

	let res = await ky.put('', {json: {data: {reqNode: reqNode, reqParent: reqParent}, _method: 'updateTree'}}).json()
}

function selectNodeRightClick(node) {
	if (node.isSelected) return
	slVueTreeRef.value.traverse((node, nodeModel, path) => {
		nodeModel.isSelected = false
	})
	slVueTreeRef.value.updateNode({path: node.path, patch: {isSelected: true}})
	selectedNode.value = [node]
}

async function getActionsContext() {
	let res = await ky.post('', {
		json: {
			items: selectedNode.value,
			type: 'context',
			_method: 'getActions'
		}
	}).json()
	if (res.data.length) {
		for (const re of res.data) {
			actionsContext.value.push(re)
		}
	}
	// if (res.data.length) {
	// 	actions.value = res.data
	// 	contextMenuIsVisible.value = true
	// 	const $contextMenu = contextmenu.value
	// 	$contextMenu.style.left = event.clientX + 'px'
	// 	$contextMenu.style.top = event.clientY + 'px'
	// }
}

async function getActionsTools() {
	let res = await ky.post('', {
		json: {
			items: selectedNode.value,
			type: 'tools',
			_method: 'getActions'
		}
	}).json()
	if (res.data.length) {
		for (const re of res.data) {
			actionsTools.value.push(re)
		}
	}
}

async function showContextMenu(node, event) {
	event.preventDefault()
	selectNodeRightClick(node)
	contextMenuIsVisible.value = true
	const $contextMenu = contextmenu.value
	$contextMenu.style.left = event.clientX + 'px'
	$contextMenu.style.top = event.clientY + 'px'

	getActionsContext()
	if(!actionsTools.value.length) getActionsTools()
	// let res = await ky.post('', {
	// 	json: {
	// 		type: selectedNode.value.data.type,
	// 		data: selectedNode.value.data,
	// 		_method: 'getActions'
	// 	}
	// }).json()
	// if (res.data.length) {
	// 	actions.value = res.data
	// 	contextMenuIsVisible.value = true
	// 	const $contextMenu = contextmenu.value
	// 	$contextMenu.style.left = event.clientX + 'px'
	// 	$contextMenu.style.top = event.clientY + 'px'
	// }
}


async function initAction(id) {
	let data = {
		actionID: id,
		items: selectedNode.value,
		config: ''
	}
	let res = await ky.put('', {json: {data: data, _method: 'action'}}).json()
	// console.log(res.data)
	if(res.data){
		if(res.data.event === 'download'){
			window.open(`/${res.data.data}`);
		}
	}
	// if (res.data.type === 'external') {
	// 	await getHTML(res.data.data)
	// 	modalCount.value++
	// 	isActionPopUp.value = true
	// }

}

function removeNodes() {
	contextMenuIsVisible.value = false
	const $slVueTree = slVueTreeRef.value
	const paths = $slVueTree.getSelected().map((node) => node.path)
	$slVueTree.remove(paths)
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

.modal-content {
	padding: 31px 41px;
	overflow: auto;
	height: 100vh;
}

.close-admin-modal-pu {
	top: 30px;
	right: 33px
}

.btn[disabled],
.action-disabled {
	pointer-events: none;
	opacity: 0.5;
}
</style>
