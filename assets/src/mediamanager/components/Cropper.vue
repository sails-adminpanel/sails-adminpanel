<template>
    <div
        class="px-12 py-14 max-w-[1440px] w-full mx-auto overflow-y-auto h-full"
        ref="cropperWrapperRef"
    >
        <vue-cropper
            ref="vueCropperRef"
            class="max-h-[540px]"
            :src="item.url"
            alt="Source Image"
            v-bind="cropperOptions"
            @crop="onCrop"
        />
        <div class="grid grid-cols-4 gap-2 mt-4">
            <div class="flex flex-col gap-2" v-for="(value, key, i) in coord">
                <label class="admin-panel__title capitalize" for="author">{{
                    key
                }}</label>
                <input
                    class="text-input w-full h-[20px]"
                    type="number"
                    :id="key"
                    :name="key"
                    v-model.trim="coord[key]"
                    @input="setCoordinates"
                />
            </div>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
            <button
                type="button"
                class="flex justify-center items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.move(0, -20)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"
                    />
                </svg>
            </button>
            <button
                type="button"
                class="flex justify-center items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.move(0, 20)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 rotate-180"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"
                    />
                </svg>
            </button>
            <button
                type="button"
                class="flex justify-center items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.move(-20, 0)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 -rotate-90"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"
                    />
                </svg>
            </button>
            <button
                type="button"
                class="flex justify-center items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.move(20, 0)"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 rotate-90"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8z"
                    />
                </svg>
            </button>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
            <button
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.flipX()"
            >
                Flip X
            </button>
            <button
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="vueCropperRef?.flipY()"
            >
                Flip Y
            </button>
            <button class="btn btn-back btn-text" @click="preview">
                Preview
            </button>
            <button class="btn btn-green btn-text" @click="save">Save</button>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
            <div
                class="checkbox relative flex items-center gap-2 justify-start w-max"
            >
                <label for="conv-webp">Convert WebP</label>
                <input
                    type="checkbox"
                    class="check-flex"
                    id="conv-webp"
                    name="conv-webp"
                    v-model="convertWebp"
                    @change="convertJpeg = false"
                />
                <span class="check"></span>
            </div>
            <div
                class="checkbox relative flex items-center gap-2 justify-start w-max"
            >
                <label for="conv-jpeg">Convert Jpeg</label>
                <input
                    type="checkbox"
                    class="check-flex"
                    id="conv-jpeg"
                    name="conv-jpeg"
                    v-model="convertJpeg"
                    @change="convertWebp = false"
                />
                <span class="check"></span>
            </div>
        </div>
        <div
            class="w-screen h-screen bg-black/90 fixed z-[10000] top-0 left-0 transition"
            :class="previewModalClass"
        >
            <div
                tabindex="-1"
                class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full"
            >
                <div class="relative flex items-center justify-center h-full">
                    <button
                        type="button"
                        @click="previewShow = false"
                        class="absolute top-3 right-2.5 text-gray-200 dark:text-gray-300 bg-transparent hover:text-red-600 dark:hover:text-red-600 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                    >
                        <svg
                            class="w-7 h-7"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <img src="" alt="" ref="previewRef" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, reactive, computed, watch } from "vue";
import VueCropper from "@ballcat/vue-cropper";
import "cropperjs/dist/cropper.css";

const props = defineProps(["item"]);
const cropperWrapperRef = ref(null);
const vueCropperRef = ref(null);
const cropperPopup = ref();
const closeCropper = inject("closeCropper");
const previewShow = ref(false);
const previewRef = ref(null);
const uploadUrl = inject("uploadUrl");
const addVariant = inject("addVariant");
const group = inject("group");
const convertWebp = ref(false);
const convertJpeg = ref(false);

const coord = reactive({
    x: "",
    y: "",
    width: "",
    height: "",
});

let previewModalClass = computed(() => {
    return previewShow.value ? "opacity-100 visible" : "opacity-0 invisible";
});

const cropperOptions = reactive({
    viewMode: 2,
    responsive: true,
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    modal: true,
    guides: true,
    center: true,
    highlight: true,
    background: true,
    autoCrop: true,
    movable: true,
    rotatable: true,
    scalable: true,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
});

onMounted(async () => {
    cropperPopup.value = AdminPopUp.new();
    cropperPopup.value.on("open", () => {
        cropperPopup.value.content.appendChild(cropperWrapperRef.value);
    });
    cropperPopup.value.on("close", () => {
        console.log("closed cropper");
        closeCropper();
    });
});

function setCoordinates() {
    vueCropperRef.value.setData(coord);
}

function onCrop(e) {
    coord.x = convertNumber(e.detail.x);
    coord.y = convertNumber(e.detail.y);
    coord.width = convertNumber(e.detail.width);
    coord.height = convertNumber(e.detail.height);
}

const convertNumber = (num) => (num != null ? Math.round(num) : undefined);

function preview() {
    previewShow.value = true;
    vueCropperRef.value.getCroppedCanvas().toBlob(
        (blob) => {
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);
            previewRef.value.src = imageUrl;
        },
        props.item.mimeType,
        1,
    );
}

async function save() {
    let convert = convertWebp.value
        ? "image/webp"
        : convertJpeg.value
          ? "image/jpeg"
          : props.item.mimeType;
    vueCropperRef.value.getCroppedCanvas().toBlob(
        async (blob) => {
            const parts = convert.split("/");
            let config = {
                width: coord.width,
                height: coord.height,
            };
            let name = `${props.item.filename}_${config.width}x${config.height}.${parts[1]}`;
            const form = new FormData();
            form.append("name", name);
            form.append("group", group);
            form.append("isCropped", true);
            form.append("item", JSON.stringify(props.item));
            form.append("_method", "variant");
            form.append("file", blob);
            let res = await ky.post(uploadUrl, { body: form }).json();
            if (res.msg === "success") {
                addVariant(props.item, res.data);
                cropperPopup.value.closeModal();
            }
        },
        convert,
        0.9,
    );
}
</script>

<style scoped></style>
