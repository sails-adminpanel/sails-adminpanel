<template>
	<button class="btn btn-add" @click="addFolder(true)"><i class="las la-plus"></i><span>create</span></button>
	<div class="custom-catalog__container">
		<sl-vue-tree-next
			v-model="nodes"
			ref="slVueTreeRef"
			id="slVueTree_id"
			:allow-multiselect="false"
			@select="nodeSelected"
			@drop="nodeDropped"
			@toggle="nodeToggled"
			@nodecontextmenu="showContextMenu"
		>
			<template #title="{ node }">
                            <span class="item-icon">
                                <i class="fa-solid fa-file" v-if="node.isLeaf"></i>
                                <i class="fa-solid fa-folder" v-if="!node.isLeaf"></i>
                            </span>

				{{ node.title }}
			</template>

			<template #toggle="{ node }">
                            <span v-if="!node.isLeaf">
                                <i v-if="node.isExpanded" class="fa fa-chevron-down"></i>
                                <i v-if="!node.isExpanded" class="fa fa-chevron-right"></i>
                            </span>
			</template>

			<template #sidebar="{ node }">
                            <span class="visible-icon" @click="event => toggleVisibility(event, node)">
                                <i v-if="!node.data || node.data.visible !== false" class="fa fa-eye"></i>
                                <i v-if="node.data && node.data.visible === false" class="fa fa-eye-slash"></i>
                            </span>
			</template>

			<template #draginfo="draginfo"> {{ selectedNodesTitle }}</template>
		</sl-vue-tree-next>
		<div class="json-preview">
			<h2>JSON Preview</h2>
			<pre>{{ JSON.stringify(nodes, null, 4) }}</pre>
		</div>
	</div>
	<div class="contextmenu" ref="contextmenu" id="contextmenu" v-show="contextMenuIsVisible">
		<div class="custom-catalog__add">
			<span>Add</span>
			<div class="custom-catalog__add-items">
				<ul>
					<li @click="addFolder(true)">
						New Folder
					</li>
					<li @click="addFolder(false)">
						In Selected Folder
					</li>
					<li @click="addItem">
						Item
					</li>
				</ul>
			</div>
		</div>
		<div @click="removeNode" v-if="selectedNodesTitle">Remove</div>
	</div>
	<pop-up @reset="closePopup" v-for="index in modalCount" :key="index" ref="parentPopUp">
		<div v-if="isFolder" class="custom-catalog__form">
			<div class="custom-catalog__form-input">
				<label for="folder">Folder name</label>
				<input type="text" name="folder" id="folder" v-model="folderName">
			</div>
			<div>
				<button class="btn btn-green" @click="saveFolder(0)">
					Save
				</button>
			</div>
		</div>
		<div v-if="isItem" class="custom-catalog__form">
			<div class="custom-catalog__form-input">
				<label for="item">Item name</label>
				<input type="text" name="item" id="item" v-model="itemName">
			</div>
			<div>
				<button class="btn btn-green" @click="saveItem(0)">
					Save
				</button>
			</div>
		</div>
	</pop-up>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive} from 'vue'
import PopUp from "./PopUp.vue";

let nodes = reactive([])

let contextMenuIsVisible = ref(false)
let lastEvent = ref('No last event')
let selectedNodesTitle = ref('')
let slVueTreeRef = ref(null)
let contextmenu = ref(null)
let modalCount = ref(0)
let isFolder = ref(false)
let [folderName, itemName] = defineModel()
let isItem = ref(false)
let parentPopUp = ref(null)
let newFolder = ref(false)

onMounted(() => {
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
})

function addFolder(isNew) {
	newFolder.value = isNew
	modalCount.value++
	isFolder.value = true
}

function saveFolder(index) {
	if (newFolder.value) {
		nodes.push({
			title: folderName
		})
	} else {
		let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
		recurciveFindAndInsert(selectedFolderPath)
		folderName = ''
	}
	folderName = ''
	slVueTreeRef.value.updateNode([0])
	isFolder.value = false
	parentPopUp.value[index].closePopup()
}

function recurciveFindAndInsert(path, nodesArr) {
	let index = path.shift()
	let result = null
	if (nodesArr && nodesArr.children.length) {
		result = nodesArr.children.find((e, i) => i === index)
	} else {
		result = nodes.find((e, i) => i === index)
	}
	if (path.length) {
		recurciveFindAndInsert(path, result)
	} else {
		if (result.children) {
			result.children.push({title: folderName})
		} else {
			result.children = []
			result.children.push({title: folderName})
		}
	}

}

function addItem() {
	modalCount.value++
	isItem.value = true
	itemName = ''
}

function saveItem(index) {

	let selectedFolderPath = slVueTreeRef.value.getSelected().filter(e => e.isLeaf === false)[0].path
	recurciveFindAndInsertItem(selectedFolderPath)

	itemName = ''
	slVueTreeRef.value.updateNode([0])
	isItem.value = false
	parentPopUp.value[index].closePopup()
}

function recurciveFindAndInsertItem(path, nodesArr) {
	let index = path.shift()
	let result = null
	if (nodesArr && nodesArr.children.length) {
		result = nodesArr.children.find((e, i) => i === index)
	} else {
		result = nodes.find((e, i) => i === index)
	}
	if (path.length) {
		recurciveFindAndInsertItem(path, result)
	} else {
		if (result.children) {
			result.children.push({title: itemName, isLeaf: true})
		} else {
			result.children = []
			result.children.push({title: itemName, isLeaf: true})
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
	selectedNodesTitle.value = nodes.map((node) => node.title).join(', ')
	lastEvent.value = `Select nodes: ${selectedNodesTitle.value}`
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
	modalCount.value--
	isFolder.value = false
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
