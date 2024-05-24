<template>
	<div class="last-event">Last event: {{ lastEvent }}</div>
	<div class="custom-catalog__container">
		<sl-vue-tree-next
			v-model="nodes"
			ref="slVueTreeRef"
			:allow-multiselect="true"
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
	<div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
		<div @click="removeNode">Remove</div>
	</div>
</template>

<script setup>
import {SlVueTreeNext} from 'sl-vue-tree-next'
import {ref, onMounted, computed, reactive} from 'vue'

let nodes = reactive([
	{title: 'Item1', isLeaf: true},
	{title: 'Item2', isLeaf: true, data: {visible: false}},
	{title: 'Folder1'},
	{
		title: 'Folder2',
		isExpanded: true,
		children: [
			{title: 'Item3', isLeaf: true},
			{title: 'Item4', isLeaf: true},
			{
				title: 'Folder3',
				children: [{title: 'Item5', isLeaf: true}],
			},
		],
	},
	{title: 'Folder5', isExpanded: false},
	{title: 'Item6', isLeaf: true},
	{title: 'Item7', isLeaf: true, data: {visible: false}},
	{
		title: 'Folder6',
		children: [
			{
				title: 'Folder7',
				children: [
					{title: 'Item8', isLeaf: true},
					{title: 'Item9', isLeaf: true},
				],
			},
		],
	},
])

let contextMenuIsVisible = ref(false)
let lastEvent = ref('No last event')
let selectedNodesTitle = ref('')
let slVueTreeRef = ref(null)
let contextmenu = ref(null)


onMounted(() => {
	// window.slVueTree = slVueTreeRef.value
	console.log(slVueTreeRef.value)
})

function toggleVisibility(event, node) {
	const slVueTree = slVueTreeRef.value
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
