<template>
	<div class="modal-content" ref="modal" v-show="visible">
		<slot></slot>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {AdminPopUp} from "../pop-up/admin-pop-up";

const emit = defineEmits(['reset'])
let visible = ref(false)
let popup = ref(null)
let modal = ref(null)

onMounted(() => {
	popup.value = AdminPopUp.new()
	popup.value.on('open', () => {
		visible.value = true
		popup.value.content.appendChild(modal.value);
	})
	popup.value.on('close', () => {
		emit('reset')
	})
	console.log(popup.value.id)
})

function closePopup() {
	popup.closeModal()
}
defineExpose({
	closePopup
})
</script>

<style>
.modal-content {
	padding: 31px 41px;
	overflow: auto;
	height: 100vh;
}

.close-admin-modal-pu {
	top: 30px;
	right: 33px
}
</style>
