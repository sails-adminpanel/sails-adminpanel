<template>
    <div class="alert bg-red-600 rounded font-medium mt-8 mb-4" v-if="alert">
        <div class="alert-items">
            <div class="alert-item flex gap-2 p-2 text-white justify-between">
                <div class="flex gap-2">
                    <div class="alert-icon-wrapper">
                        <i class="las la-exclamation-triangle text-sm"></i>
                    </div>
                    <span class="alert-text">{{ alert }}</span>
                </div>
                <div class="cursor-pointer" @click="alert = ''">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div
        class="h-[106px] relative transition"
        :class="loading ? 'opacity-60' : ''"
    >
        <div
            @drop.prevent="onDrop"
            class="drop-zone"
            @click="fileInput.click()"
        >
            <span class="text-sm text-[#C6BBBB]">dropzone</span>
        </div>
        <input
            type="file"
            name=""
            id=""
            @input="onLoad"
            ref="fileInput"
            hidden="hidden"
            multiple
        />
        <span
            class="loader transition"
            :class="loading ? 'loader--active' : ''"
        ></span>
    </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";

const fileInput = ref(null);
const uploadUrl = inject("uploadUrl");
const group = inject("group");
const loading = ref(false);
const alert = ref("");

const pushData = inject("pushData");

async function onDrop(e) {
    loading.value = true;
    for (const file of e.dataTransfer.files) {
        await upload(file);
    }
}

async function onLoad(e) {
    for (const file of e.target.files) {
        loading.value = true;
        await upload(file);
    }
}

async function upload(file) {
    let form = new FormData();
    form.append("name", file.name);
    form.append("_method", "upload");
    form.append("group", group);
    form.append("file", file);
    let res = await ky.post(uploadUrl, { body: form }).json();
    console.log(res.data);
    if (res.msg === "success") {
        loading.value = false;
        pushData(res.data);
    } else {
        loading.value = false;
        alert.value = res.msg;
    }
}

function preventDefaults(e) {
    e.preventDefault();
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
    events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults);
    });
});

onUnmounted(() => {
    events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults);
    });
});
</script>
<style scoped></style>
