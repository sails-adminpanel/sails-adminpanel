<template>
	<button class="btn btn-add mb-4" @click="createCatalog" v-if="!catalogCreated"><i class="las la-plus"></i><span>create</span>
	</button>
	<div v-else>
		<div class="flex items-center gap-4">
		<div class="flex flex-col gap-2">
			<label class="admin-panel__title" for="root-group">Select and create root Group Item</label>
			<select id="root-group" class="select" @change="create(true, $event)">
				<option selected disabled>Select Group</option>
				<option v-for="item in ItemsGroup" :value="item.type">{{ item.name }}</option>
			</select>
		</div>
			<div class="flex flex-col gap-2">
			<label class="admin-panel__title" for="root-group">Select and create root Item</label>
			<select id="root-group" class="select" @change="createItem">
				<option selected disabled>Select Item</option>
				<option v-for="item in ItemsItem" :value="item.type">{{ item.name }}</option>
			</select>
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
	</div>
	<div class="contextmenu" ref="contextmenu" id="contextmenu" v-show="contextMenuIsVisible">
		<div class="custom-catalog__add">
<!--			<span>Add</span>-->
<!--			<div class="custom-catalog__add-items">-->
<!--				<ul>-->
<!--					<li @click="addFolder(true)">-->
<!--						New Folder-->
<!--					</li>-->
<!--					<li @click="addFolder(false)" v-if="!selectedNodesType">-->
<!--						In Selected Folder-->
<!--					</li>-->
<!--					<li @click="addItem">-->
<!--						Item-->
<!--					</li>-->
<!--				</ul>-->
<!--			</div>-->
		</div>
		<div @click="removeNode" v-if="selectedNodesTitle">Remove</div>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="parentPopUp">
		<div v-if="isFolder" class="custom-catalog__form">
			<folder @save-folder="saveFolder" :html="HTML"/>
		</div>
		<div v-if="isItem" class="custom-catalog__form">
			<Item @save-item="saveItem"/>
		</div>
	</pop-up>
	<iframe class="w-full" style="height: 1000px" :src="iFrame"></iframe>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive} from 'vue'
import PopUp from "./PopUp.vue";
import Folder from "./Components/Folder.vue";
import Item from "./Components/Item.vue";
import ky from "ky";

let nodes = ref([])

let contextMenuIsVisible = ref(false)
let lastEvent = ref('No last event')
let selectedNodesTitle = ref('')
let selectedNodesType = ref('')
let slVueTreeRef = ref(null)
let contextmenu = ref(null)
let modalCount = ref(0)
let isFolder = ref(false)
let itemName = defineModel()
let isItem = ref(false)
let parentPopUp = ref(null)
let newFolder = ref(false)
let HTML = ref('')
let ItemsGroup = ref([])
let ItemsItem = ref([])
let selectedGroup = ref([])
let selectedItem = ref([])
let catalogCreated = ref(false)
let iFrame = ref(null)

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
	})
	let catalog = await ky.post('/admin/get-catalog', {json: {slug: window.slug, id: window.id}}).json()
	if(catalog.items) {
		console.log(catalog)
		for (const catalogItem of catalog.items) {
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
})

function setCatalog(catalog) {
	nodes.value = catalog.catalog.nodes
	catalogCreated.value = catalog.catalog.created
}

function addFolder(isNew) {
	newFolder.value = isNew
	modalCount.value++
	isFolder.value = true
}

function addItem() {
	modalCount.value++
	isItem.value = true
	itemName = ''
}

async function createCatalog() {
	let catalog = await ky.post('', {json: {_method: 'createCatalog'}}).json()
	setCatalog(catalog)
}

async function create(isNew, event) {
	selectedGroup.value = event.target.value
	let resPost = await ky.post('', {json: {type: selectedGroup.value, _method: 'getHTML'}}).json()
	HTML.value = resPost.data
	addFolder(true)
}

async function createItem(event){
	selectedItem.value = event.target.value
	// let resPost = await ky.post('', {json: {type: selectedItem.value, _method: 'getHTML'}}).json()
	// HTML.value = resPost.data
	// console.log(HTML.value)
	// iFrame.value = await ky.get('/admin/model/page/add').text()
	iFrame.value = '/admin/model/page/add'
}

function saveFolder(index, data) {
	if (newFolder.value) {
		createFolder(data)
	} else {
		let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
		recurciveFindAndInsert(selectedFolderPath, false, false, folderName)
	}

	slVueTreeRef.value.updateNode([0])
	parentPopUp.value[index].closePopup()
}

async function createFolder(data) {
	data.data.type = selectedGroup.value
	let res = await ky.post('', {json: {type: selectedGroup.value, data: data, _method: 'create'}}).json()
	nodes.value = res.nodes
}

function saveItem(index, itemName) {

	let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
	recurciveFindAndInsert(selectedFolderPath, false, true, itemName)

	slVueTreeRef.value.updateNode([0])
	parentPopUp.value[index].closePopup()
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
	lastEvent.value = `Node ${node.title} is ${visible ? 'visible' : 'invisible'} now`
}

function nodeSelected(nodes, event) {
	selectedNodesTitle.value = nodes.map((node) => node.title)[0]
	selectedNodesType.value = nodes.map((node) => node.isLeaf)[0]
}

function nodeToggled(node, event) {
	lastEvent.value = `Node ${node.title} is ${node.isExpanded ? 'expanded' : 'collapsed'}`
}

function nodeDropped(nodes, position, event) {
	lastEvent.value = `Nodes: ${nodes.map((node) => node.title).join(', ')} are dropped ${position.placement} ${position.node.title}`
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
	isFolder.value = false
	isItem.value = false
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
