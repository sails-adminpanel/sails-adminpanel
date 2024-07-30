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
	<div class="custom-catalog__container h-full" v-show="nodes.length">
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
			<li v-for="action in actionsContext" @click="initAction(action.id)">
				<i v-if="action.icon" :class="`las la-${action.icon}`"></i>&nbsp;{{ action.name }}
			</li>
		</ul>
	</div>
	<div style="display: none">
		<div ref="refSelectItem">
			<SelectItem :initItemsItem="ItemsItem" @createNewItem="createNewItem" v-if="isTollAdd" :selectedNode="selectedNode"/>
		</div>
		<div ref="refItemHTML" class="custom-catalog__form">
			<ItemHTML :html="HTML" @close-all-popups="closeAllPopups" :selectedNode="selectedNode"
					  :is-json-form="isJsonForm" :JSONFormSchema="JSONFormSchema" :PopupEvent="PopupEvent"
					  v-if="isCreate"/>
		</div>
		<div ref="refActionPopup" class="custom-catalog__form">
			<ActionPopUp v-if="isPopupAction" :html="actionHTML" :is-json-form="isJsonForm" :selectedNode="selectedNode"
						 :JSONFormSchema="actionJsonFormSchema" :actionId="actionId" @closeAllPopups="closeAllPopups"/>
		</div>
	</div>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive} from 'vue'
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
let refActionPopup = ref(null)
let isPopupAction = ref(false)
let isCreate = ref(false)
let isJsonForm = ref(false)
let PopupEvent = ref(null)
let HTML = ref('')
let actionHTML = ref('')
let actionJsonFormSchema = ref(null)
let JSONFormSchema = ref(null)
let ItemsItem = ref([])
let isTollAdd = ref(false)
let actionsTools = ref([])
let actionsContext = ref([])
let isActionPopUp = ref(false)
let searchText = ref('')
let subcribeChildren = ref({})
let actionId = ref(null)

onMounted(async () => {
	document.addEventListener('click', function (e) {
		const contextmenu = document.getElementById('contextmenu')
		if (!e.composedPath().includes(contextmenu)) {
			contextMenuIsVisible.value = false
			actionsContext.value = []
		}
		const slVueTree_id = document.getElementById('slVueTree_id')
		if (!e.composedPath().includes(slVueTree_id)) {
			contextMenuIsVisible.value = false
			actionsContext.value = []
		}
		const nodesList = document.querySelector('.sl-vue-tree-next-nodes-list')
		if (!e.composedPath().includes(nodesList)) {
			contextMenuIsVisible.value = false
			actionsContext.value = []
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
		//remove subcribers
		for (const key of Object.keys(subcribeChildren.value)) {
			clearInterval(subcribeChildren.value[key])
		}
		await searchNodes()
	} else {
		reloadCatalog()
		subcribeChildren.value['root'] = setInterval(() => { // add root subscribe
			reloadCatalog()
		}, 15000)
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
	let {catalog, items, toolsActions} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	if (toolsActions) {
		for (const re of toolsActions) {
			actionsTools.value.push(re)
		}
	}
	if (items) {
		// console.log(catalog, items)
		for (const catalogItem of items) {
			ItemsItem.value.push(catalogItem)
		}
		setCatalog(catalog)
		subcribeChildren.value['root'] = setInterval(() => { // add root subscribe
			reloadCatalog()
		}, 15000)
	} else {
		// console.log(catalog)
	}
}

async function reloadCatalog() {
	let {catalog} = await ky.post('', {json: {_method: 'getCatalog'}}).json()
	setCatalog(catalog)
	selectedNode.value = []
	console.log('root reloaded')
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
	popup.on('close', async () => {
		switch (AdminPopUp.popups.length) {
			case 1:
				isCreate.value = false
				isJsonForm.value = false
				isPopupAction.value = false
				break
			case 0:
				isTollAdd.value = false
				isCreate.value = false
				isJsonForm.value = false
				isPopupAction.value = false
				break
		}
		if (selectedNode.value.length === 1) {
			await getChilds(selectedNode.value[0])
		} else {
			reloadCatalog()
		}
	})
}

async function closeAllPopups() {
	isCreate.value = false
	isTollAdd.value = false
	isJsonForm.value = false
	isPopupAction.value = false
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
			await getChilds(getParent(selectedNode.value[0]))
		}
	}
	PopupEvent.value = ''
}

function getParent(Tnode) {
	let parentNode = null
	slVueTreeRef.value.traverse((node, nodeModel, siblings) => {
		if (node.data.id === Tnode.data.parentId) {
			parentNode = node
			return false
		}
	})
	return parentNode
}

function setCatalog(catalog) {
	nodes.value = catalog.nodes
}


async function getHTML(data) {
	switch (data.type) {
		case 'html':
			HTML.value = data.data
			break
		case 'link':
			let resPost = await ky.get(data.data).text()
			HTML.value = resPost
			break
		case 'jsonForm':
			JSONFormSchema.value = JSON.parse(data.data)
			isJsonForm.value = true
			break
		default:
			break
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
	let resPost = await ky.post('', {json: {type: item.data.type, modelId: item.data.modelId ?? null, id: item.data.id, _method: 'getEditHTML'}}).json()
	await getHTML(resPost)
	PopupEvent.value = 'update'
	createPopup(refItemHTML.value)
	isCreate.value = true
}

async function deleteItem() {
	let res = await ky.delete('', {json: {data: selectedNode.value}}).json()
	if (res.data.ok) removeNodes()
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
}

//TODO we need make service for bound all subcsribed dirs into single request or ours socket
async function nodeToggled(node, event) {
	let parent = getParent(node)
	if (!node.data.parentId) {
		recurciveRemoveSubcribes(node)
	}
	if (!node.isExpanded) { //if group open
		getChilds(node)
		if (parent) {
			clearInterval(subcribeChildren.value[parent.data.id]) //remove subscribe from parent
		}
		subcribeChildren.value[node.data.id] = setInterval(() => {
			getChilds(node)
		}, 15000)
	} else {
		clearInterval(subcribeChildren.value[node.data.id])
		if (parent && parent.children.find(e => e.isExpanded) === undefined) { // if there is a parent and the parent has all groups closed
			subcribeChildren.value[parent.data.id] = setInterval(() => {
				getChilds(parent)
			}, 15000)
		}
	}

	// for root subcriber
	let openТodes = false
	slVueTreeRef.value.traverse((node, nodeModel, siblings) => {
		if (node.isExpanded) {
			openТodes = true
			return false
		}
	})
	if (openТodes) { // if isset open groups
		clearInterval(subcribeChildren.value['root']) // remove root subscribe
	} else {
		subcribeChildren.value['root'] = setInterval(() => { // add root subscribe
			reloadCatalog()
		}, 15000)
	}
}

function recurciveRemoveSubcribes(node) {
	for (const child of node.children) {
		let subscriber = subcribeChildren.value[child.data.id]
		if (subscriber) clearInterval(subcribeChildren.value[child.data.id])
		if (child.children.length) recurciveRemoveSubcribes(child)
	}
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
	if (res.data && res.data.length) {
		for (const re of res.data) {
			actionsContext.value.push(re)
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
}


async function initAction(id) {
	let action = actionsTools.value.find(e => e.id === id) ?? actionsContext.value.find(e => e.id === id)
	if (!action) return
	let res
	switch (action.type) {
		case 'link':
			res = await ky.put('', {json: {actionId: action.id, _method: 'getLink'}}).json()
			if (res.data) window.open(`${res.data}`, '_blank').focus()
			break
		case 'basic':
			let data = {
				actionID: action.id,
				items: selectedNode.value,
				config: ''
			}
			await ky.put('', {json: {data: data, _method: 'handleAction'}}).json()
			break
		case 'external':
			res = await ky.put('', {json: {actionId: action.id, _method: 'getPopUpHTML'}}).json()
			if (res.data) {
				actionHTML.value = res.data
				createPopup(refActionPopup.value)
				isPopupAction.value = true
			}
			break
		case 'json-forms':
			res = await ky.put('', {json: {actionId: action.id, _method: 'getPopUpHTML'}}).json()
			actionJsonFormSchema.value = JSON.parse(res.data)
			actionId.value= action.id
			createPopup(refActionPopup.value)
			isJsonForm.value = true
			isPopupAction.value = true
	}
}

function removeNodes() {
	contextMenuIsVisible.value = false
	const $slVueTree = slVueTreeRef.value
	const paths = $slVueTree.getSelected().map((node) => node.path)
	$slVueTree.remove(paths)
	if(!nodes.value.length){
		selectedNode.value = []
	}
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
