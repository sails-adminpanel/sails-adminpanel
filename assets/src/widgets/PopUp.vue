<template>
	<div class="modal-content" ref="modal" v-show="visible">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "PopUp",
	emits: ['reset'],
	data() {
		return {
			visible: false,
			popup: null
		}
	},
	created() {
		this.popup = AdminPopUp.new()
		this.popup.on('open', () => {
			this.visible = true
			this.popup.content.appendChild(this.$refs.modal);
		})
		this.popup.on('close', () => {
			this.$emit('reset')
		})
	},
	methods: {
		closePopup() {
			this.popup.closeModal()
		}
	}
}
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
