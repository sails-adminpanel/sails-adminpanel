<template>
	<div class="flex gap-4 items-center mb-4">
		<h1 class="text-[28px] leading-[36px] text-black dark:text-gray-300">{{ messages[_catalog.name] }}</h1>
			<select class="select select-small capitalize" v-if="_catalog.idList.length" @change="window.location = `/admin/catalog/${_catalog.slug}/${$event.target.value}`">
				<option :selected="!_catalog.id" disabled value="">{{ messages["Select Ids"] }}</option>
				<option v-for="id in _catalog.idList" :value="id" :selected="id === _catalog.id" class="capitalize">{{
						id
					}}
				</option>
			</select>
	</div>
	<div
		class="grid grid-cols-[minmax(70px,_800px)_minmax(150px,_250px)] gap-10 justify-between md:flex md:flex-col md:gap-3.5">
		<div class="sm:mr-[-24px]">
			<swiper-container class="overflow-visible overflow-x-clip catalog-swiper" init="false">
				<swiper-slide class="w-auto justify-center flex items-center h-9">
					<button class="btn btn-add" @click="toolAddGroup" :disabled="selectedNode.length > 1"><i
						class="las la-plus"></i><span>{{ messages.create }}</span>
					</button>
				</swiper-slide>
				<swiper-slide class="w-auto justify-center flex items-center h-9">
					<button class="btn btn-green" @click="updateItem"
							:disabled="selectedNode.length > 1 || !selectedNode.length"><span>{{ messages.Edit }}</span>
					</button>
				</swiper-slide>
				<swiper-slide class="w-auto justify-center flex items-center h-9">
					<button class="btn btn-red" @click="initDel"
							:disabled="!selectedNode.length"><span>{{ messages.Delete }}</span>
					</button>
				</swiper-slide>
				<template v-for="action in actionsTools">
					<swiper-slide class="w-auto justify-center flex items-center h-9">
						<button class="btn btn-add" @click="initAction(action.id)"><i
							:class="`las la-${action.icon}`"></i><span>{{ messages[action.name] }}</span>
						</button>
					</swiper-slide>
				</template>
			</swiper-container>
		</div>
		<div class="admin-panel__widget">
			<div class="widget_narrow ">
				<input class="text-input w-full input-search" type="text" :placeholder="messages.Search" value=""
					   @input="search"
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
			@nodedblclick="updateItemDBclick"
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
	<div class="contextmenu" :class="mobMenuClass" ref="contextmenu" id="contextmenu">
		<div class="hidden md:flex justify-center items-center mt-3" :class="openContextMenu ? 'rotate-180' : ''"
			 @click="openContextMenu = !openContextMenu" id="openContextMenu">
			<i class="las la-angle-up"></i>
		</div>
		<ul class="custom-catalog__actions-items">
			<li @click="toolAddGroup" class="capitalize" :class="actionCreateClass">{{ messages.create }}</li>
			<li @click="updateItem" class="capitalize" :class="actionEditClass">{{ messages.Edit }}</li>
			<li @click="initDel" class="capitalize" :class="actionDeleteClass">{{ messages.Delete }}</li>
			<li v-for="action in actionsContext" @click="initAction(action.id)">
				<i v-if="action.icon" :class="`las la-${action.icon}`"></i>&nbsp;{{ action.name }}
			</li>
		</ul>
	</div>
	<div style="display: none">
		<div ref="refSelectItem">
			<SelectItem :initItemsItem="ItemsItem" @createNewItem="createNewItem" v-if="isTollAdd"
						:selectedNode="selectedNode" :movingGroupsRootOnly="_catalog.movingGroupsRootOnly"/>
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
	<div class="w-screen h-screen bg-black/70 fixed z-[10000] top-0 left-0 transition" :class="delModalClass">
		<div tabindex="-1"
			 class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
			<div class="absolute top-1/4 left-1/2 translate-x-[-50%] w-full sm:w-[90%] max-w-md max-h-full">
				<div class="relative bg-white dark:bg-gray-600  rounded-lg shadow">
					<button type="button" @click="delModalShow = false"
							class="absolute top-3 right-2.5 text-gray-400 dark:text-gray-300 bg-transparent hover:text-red-600 dark:hover:text-red-600 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center">
						<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
							 viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
								  stroke-width="2"
								  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
						</svg>
						<span class="sr-only">Close modal</span>
					</button>
					<div class="p-6 text-center">
						<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
							{{ messages["Are you sure?"] }}</h3>
						<button type="button" @click="deleteItem"
								class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
							{{ messages["Yes, I'm sure"] }}
						</button>
						<button type="button" @click="delModalShow = false"
								class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
							{{ messages["No, cancel"] }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

import {SlVueTreeNext} from '@sails-adminpanel/sl-vue-tree-next'
import {ref, onMounted, computed, reactive, inject} from 'vue'
import ItemHTML from "./Components/ItemHTML.vue";
import SelectItem from "./Components/SelectItem.vue";
import ActionPopUp from "./Components/ActionPopUp.vue";
import debounce from "lodash/debounce"
import {window} from "@interactjs/utils/window";

const messages = inject('messages')

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
let openContextMenu = ref(false)
let delModalShow = ref(false)
let _catalog = reactive({
	name: null,
	id: null,
	slug: null,
	movingGroupsRootOnly: null,
	idList: []
})

onMounted(async () => {
	document.addEventListener('click', function (e) {
		const contextmenu = document.getElementById('contextmenu')
		if (!e.composedPath().includes(contextmenu)) {
			contextMenuIsVisible.value = false
			actionsContext.value = []
		}
	})
	getCatalog()

	const action_swiperEl = document.querySelector('.catalog-swiper');
	// swiper parameters
	const actionSwiperParams = {
		slidesPerView: 'auto',
		speed: 500,
		navigation: false,
		spaceBetween: 6,
		on: {
			init: function () {
				setTimeout(function () {
					action_swiperEl.setAttribute('style', 'width: calc(100vw - 24px)')
					action_swiperEl.style.width = 'auto'
				}, 100)
			},
		},
	};

	// now we need to assign all parameters to Swiper element
	Object.assign(action_swiperEl, actionSwiperParams);

	// and now initialize it
	action_swiperEl.initialize();
})

let actionCreateClass = computed(() => {
	return selectedNode.value.length > 1 ? 'action-disabled' : ''
})

let delModalClass = computed(() => {
	return delModalShow.value ? 'opacity-100 visible' : 'opacity-0 invisible';
})

let actionEditClass = computed(() => {
	return selectedNode.value.length > 1 || !selectedNode.value.length ? 'action-disabled' : ''
})
let actionDeleteClass = computed(() => {
	return !selectedNode.value.length ? 'action-disabled' : ''
})
let mobMenuClass = computed(() => {
	if (openContextMenu.value && contextMenuIsVisible.value) {
		return 'contextmenu--active contextmenu--active-show'
	} else if (contextMenuIsVisible.value) {
		return 'contextmenu--active'
	}
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
		}, 30000)
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
	console.log(catalog)
	if (items) {
		// console.log(catalog, items)
		for (const catalogItem of items) {
			ItemsItem.value.push(catalogItem)
		}
		setCatalog(catalog)
		subcribeChildren.value['root'] = setInterval(() => { // add root subscribe
			reloadCatalog()
		}, 30000)
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
		if (!selectedNode.value.length || selectedNode.value[0]?.data.parentId === null) {
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
	_catalog.movingGroupsRootOnly = catalog.movingGroupsRootOnly
	_catalog.name = catalog.catalogName
	_catalog.id = catalog.catalogId
	_catalog.slug = catalog.catalogSlug
	_catalog.idList = catalog.idList
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
	let resPost = await ky.post('', {
		json: {
			type: item.data.type,
			modelId: item.data.modelId ?? null,
			id: item.data.id,
			_method: 'getEditHTML'
		}
	}).json()
	await getHTML(resPost)
	PopupEvent.value = 'update'
	createPopup(refItemHTML.value)
	isCreate.value = true
}

async function updateItemDBclick(){
	let item = JSON.parse(localStorage.getItem('selectedNode'))
	let resPost = await ky.post('', {
		json: {
			type: item.data.type,
			modelId: item.data.modelId ?? null,
			id: item.data.id,
			_method: 'getEditHTML'
		}
	}).json()
	await getHTML(resPost)
	PopupEvent.value = 'update'
	createPopup(refItemHTML.value)
	isCreate.value = true
}

function initDel() {
	delModalShow.value = true
}

async function deleteItem() {
	if (selectedNode.value.length) {
		let res = await ky.delete('', {json: {data: selectedNode.value}}).json()
		if (res.data.ok) removeNodes()
	}
	delModalShow.value = false
	selectedNode.value = []
}

function nodeSelected(nodes, event) {
	if (nodes.length === 1) {
		let node = nodes[0]
		localStorage.setItem('selectedNode', JSON.stringify(node))
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
		}, 30000)
	} else {
		clearInterval(subcribeChildren.value[node.data.id])
		if (parent && parent.children.find(e => e.isExpanded) === undefined) { // if there is a parent and the parent has all groups closed
			subcribeChildren.value[parent.data.id] = setInterval(() => {
				getChilds(parent)
			}, 30000)
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
		}, 30000)
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
	// console.log('Node: ', reqNode, 'parent: ', reqParent)
	if (_catalog.movingGroupsRootOnly === true) {
		if (reqParent.data.id !== 0 && !reqNode.isLeaf) {
			reloadCatalog()
			return
		}
	}
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
	if (window.innerWidth >= 769) {
		$contextMenu.style.left = event.clientX + 'px'
		$contextMenu.style.top = event.clientY + 'px'
	} else {
		$contextMenu.style.left = 0
		$contextMenu.style.bottom = 0
	}
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
			actionId.value = action.id
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
	if (!nodes.value.length) {
		selectedNode.value = []
	}
}

</script>
<style>
</style>
