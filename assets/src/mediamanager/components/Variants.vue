<template>
    <div
        class="pl-12 py-14 max-w-[1440px] w-full mx-auto overflow-y-auto h-full"
        ref="sizesRef"
    >
        <div
            class="alert bg-red-600 rounded font-medium mt-8 mb-4"
            v-if="alert"
        >
            <div class="alert-items">
                <div
                    class="alert-item flex gap-2 p-2 text-white justify-between"
                >
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
        <div class="flex gap-4 mt-4 pr-[70px] mb-8 h-[130px]">
            <div class="basis-1/2">
                <div
                    class="relative transition h-full"
                    :class="loading ? 'opacity-60' : ''"
                >
                    <div
                        @drop.prevent="onDrop($event, 'var')"
                        class="drop-zone"
                        @click="fileInputVar.click()"
                    >
                        <span class="text-base text-[#C6BBBB]"
                            >Загрузить вариант</span
                        >
                    </div>
                    <input
                        type="file"
                        name=""
                        id=""
                        @input="onLoad($event, 'var')"
                        ref="fileInputVar"
                        hidden="hidden"
                        multiple
                    />
                    <span
                        class="loader transition"
                        :class="loadingVar ? 'loader--active' : ''"
                    ></span>
                </div>
            </div>
            <div class="basis-1/2 flex flex-col gap-2">
                <div
                    class="relative transition h-full"
                    :class="locDropzoneClass"
                >
                    <div
                        @drop.prevent="onDrop($event, 'loc')"
                        class="drop-zone"
                        @click="fileInputLoc.click()"
                    >
                        <span class="text-base text-black"
                            >Загрузить локаль</span
                        >
                    </div>
                    <input
                        type="file"
                        name=""
                        id=""
                        @input="onLoad($event, 'loc')"
                        ref="fileInputLoc"
                        hidden="hidden"
                        multiple
                    />
                    <span
                        class="loader transition"
                        :class="loadingLoc ? 'loader--active' : ''"
                    ></span>
                </div>
                <input
                    type="text"
                    class="text-input"
                    placeholder="locale id"
                    id="var-loc"
                    v-model="loc"
                />
            </div>
        </div>
        <div>
            <table
                class="min-w-full w-full text-left text-sm font-light text-surface dark:text-white"
            >
                <colgroup>
                    <col span="1" style="width: 40%" />
                    <col span="1" style="width: 15%" />
                    <col span="1" style="width: 15%" />
                    <col span="1" style="width: 15%" />
                    <col span="1" style="width: 15%" />
                </colgroup>
                <thead
                    class="border-b border-neutral-200 font-medium dark:border-white/10"
                >
                    <tr>
                        <th scope="col" class="p-2 text-left">Файл</th>
                        <th scope="col" class="p-2 text-left">Tag</th>
                        <th scope="col" class="p-2 text-left">Тип</th>
                        <th scope="col" class="p-2 text-left">W x H</th>
                        <th scope="col" class="p-2 text-left"></th>
                        <th scope="col" class="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, i) in mediaList"
                        class="border-b border-neutral-200 dark:border-white/10 font-normal text-base"
                    >
                        <td class="p-2">
                            <img
                                v-if="imagesTypes.has(item.mimeType)"
                                :src="imageUrl(item)"
                                alt=""
                                class="w-full h-full max-w-[250px]"
                            />
                            <span v-else>{{ item.filename }}</span>
                        </td>
                        <td class="p-2">
                            {{ item.tag }}
                        </td>
                        <td class="p-2">{{ item.mimeType }}</td>
                        <td class="p-2">
                            {{ imageSize(item.meta) }}
                        </td>
                        <td class="p-2">
                            <div class="flex gap-4 items-center">
                                <button
                                    class="btn btn-back btn-text"
                                    @click="preview(item)"
                                >
                                    Preview
                                </button>
                                <div
                                    class="text-red-500 hover:text-red-800 transition cursor-pointer"
                                    @click="destroy(item)"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from "vue";

const props = defineProps(["item"]);

const sizesRef = ref(null);
const sizesPopup = ref();
const closeSizes = inject("closeSizes");
const mediaList = ref([]);
const uploadUrl = inject("uploadUrl");
const fileInputVar = ref(null);
const fileInputLoc = ref(null);
const loadingLoc = ref(false);
const loadingVar = ref(false);
const group = inject("group");
const loc = ref("");
const addVariant = inject("addVariant");
const alert = ref("");
const imagesTypes = new Set([
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
]);
const managerId = inject("managerId");
const deleteVariant = inject("deleteVariant");

onMounted(async () => {
    sizesPopup.value = AdminPopUp.new();
    sizesPopup.value.on("open", () => {
        sizesPopup.value.content.appendChild(sizesRef.value);
    });
    sizesPopup.value.on("close", () => {
        console.log("closed sizes");
        closeSizes();
    });
    await getData();
});

const locDropzoneClass = computed(() => {
    if (loc.value === "") {
        return "pointer-events-none opacity-60";
    } else if (loadingLoc.value) {
        return "opacity-60";
    } else {
        return "";
    }
});

function imageUrl(item) {
    if (item.mimeType && item.mimeType.split("/")[0] === 'image') {
        return `/admin/get-thumbs?id=${item.id}&managerId=${managerId}`;
    } else {
        let iconPath = `/admin/assets/fileuploader/icons/default.svg`;
        if (item.url) {
            const extension = item.url.split(/[#?]/)[0].split(".").pop().trim();
            iconPath = `/admin/assets/fileuploader/icons/${extension}.svg`;
        }
        return iconPath;
    }
}

async function onDrop(e, type) {
    type === "loc" ? (loadingLoc.value = true) : (loadingVar.value = true);
    for (const file of e.dataTransfer.files) {
        await upload(file, type);
    }
}

async function onLoad(e, type) {
    for (const file of e.target.files) {
        type === "loc" ? (loadingLoc.value = true) : (loadingVar.value = true);
        await upload(file, type);
    }
}

async function upload(file, type) {
    let form = new FormData();
    form.append("name", file.name);
    form.append("_method", "variant");
    form.append("group", group);
    form.append("item", JSON.stringify(props.item));
    form.append("isCropped", false);
    form.append("localeId", loc.value);
    form.append("file", file);

    let res = await ky.post(uploadUrl, { body: form }).json();
    if (res.msg === "success") {
        type === "loc"
            ? (loadingLoc.value = false)
            : (loadingVar.value = false);
        mediaList.value.unshift(res.data);
        addVariant(props.item, res.data);
        loc.value = "";
    } else {
        type === "loc"
            ? (loadingLoc.value = false)
            : (loadingVar.value = false);
        alert.value = res.msg;
    }
}

async function getData() {
    let res = await ky
        .post(uploadUrl, { json: { _method: "getChildren", item: props.item } })
        .json();
    if (res.data) {
        mediaList.value = [props.item, ...res.data];
    }
}

async function destroy(item) {
    let res = await ky.delete(uploadUrl, { json: { item: item } }).json();
    if (res.msg === "ok") deleteVariant(props.item, item);
    mediaList.value = mediaList.value.filter((e) => e.id !== item.id);
}

function imageSize(meta) {
    let size = meta.find((e) => e.key === "imageSizes");
    if (size) {
        // let size = meta.find((e) => e.key === "imageSizes");
        return `${size.value.width}x${size.value.height}`;
    } else {
        return "---";
    }
}
function preview(item) {
    window.open(item.url, "_blank").focus();
}
</script>

<style scoped></style>
