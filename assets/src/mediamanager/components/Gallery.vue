<template>
    <div
        class="p-10 max-w-[1440px] w-full mx-auto galleryRef overflow-y-auto h-full"
        ref="galleryRef"
    >
        <div class="mx-auto mt-7 mb-11">
            <DropZone />
        </div>
        <div class="flex justify-between">
            <div class="basis-full">
                <label
                    for="default-search"
                    class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >Search</label
                >
                <div class="relative">
                    <div
                        class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                    >
                        <svg
                            class="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        class="outline-none block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search..."
                        @input="search"
                    />
                </div>
            </div>
        </div>
        <div class="flex justify-end">
            <div class="inline-flex gap-4 mb-4 pb-2 mt-4 text-sm border-b">
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="type === 'image' ? 'active' : ''"
                    @click="changeLayout('tile', 'image')"
                    >Изображения</span
                >
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="type === 'video' ? 'active' : ''"
                    @click="changeLayout('table', 'video')"
                    >Видео</span
                >
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="type === 'text' ? 'active' : ''"
                    @click="changeLayout('table', 'text')"
                    >Текст</span
                >
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="type === 'application' ? 'active' : ''"
                    @click="changeLayout('table', 'application')"
                    >Приложения</span
                >
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="
                        type === 'all' && layout.name === 'TableL'
                            ? 'active'
                            : ''
                    "
                    @click="changeLayout('table', 'all')"
                    >Таблица</span
                >
                <span
                    class="text-gray-500 hover:text-green-700 cursor-pointer"
                    :class="
                        type === 'all' && layout.name === 'Tile' ? 'active' : ''
                    "
                    @click="changeLayout('tile', 'all')"
                    >Плитка</span
                >
            </div>
        </div>
        <component :is="layout" :mediaList="mediaList" />
        <div class="flex justify-center mt-4" v-if="isLoadMore">
            <span class="load-more btn btn-back" @click="loadMore"
                >Load more</span
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "Gallery",
};
</script>

<script setup>
import debounce from "lodash/debounce";
import Tile from "./Tile.vue";
import TableL from "./TableL.vue";
import DropZone from "./DropZone.vue";
import { computed, inject, onMounted, ref, provide } from "vue";

const layout = ref(Tile);
const type = ref("all");
const galleryRef = ref(null);
const uploadUrl = inject("uploadUrl");
const mediaList = ref([]);
const skip = ref(0);
const isLoadMore = ref(true);
const count = 5;
const closeGallery = inject("closeGallery");
const group = inject("group");

onMounted(async () => {
    let galleryPopup = AdminPopUp.new();
    galleryPopup.on("open", () => {
        galleryPopup.content.appendChild(galleryRef.value);
    });
    galleryPopup.on("close", () => {
        console.log("closed gallery");
        closeGallery();
    });
    await getData("all");
});

async function getData(type) {
    let data = await ky
        .get(`${uploadUrl}?count=${count}&skip=0&type=${type}&group=${group}`)
        .json();
    mediaList.value = data.data;
    console.log(data);
    isLoadMore.value = data.next;
}

provide("pushData", (elem) => {
    mediaList.value = [...elem, ...mediaList.value];
});

provide("deleteData", (elem) => {
    mediaList.value = mediaList.value.filter((obj) => obj.id !== elem.id);
});

provide("deleteVariant", (item, variant) => {
    mediaList.value = mediaList.value.map((obj) => {
        if (obj.id === item.id) {
            return {
                ...obj,
                variants: obj.variants.filter((e) => e.id !== variant.id),
            };
        }
        return obj;
    });
});

provide("addVariant", (item, newItem) => {
    mediaList.value = mediaList.value.map((obj) => {
        if (obj.id === item.id) {
            return {
                ...obj,
                variants: [...obj.variants, newItem],
            };
        }
        return obj;
    });
});

async function loadMore() {
    skip.value += count;
    let data = await ky
        .get(
            `${uploadUrl}?count=${count}&skip=${skip.value}&type=${type.value}`,
        )
        .json();
    mediaList.value = [...mediaList.value, ...data.data];
    isLoadMore.value = data.next;
}

async function changeLayout(Ltype, Rtype) {
    type.value = Rtype;
    skip.value = 0;
    await getData(Rtype);
    switch (Ltype) {
        case "tile":
            layout.value = Tile;
            break;
        case "table":
            layout.value = TableL;
    }
}

const search = debounce(async (e) => {
    if (e.target.value.length > 0) {
        isLoadMore.value = false;
        skip.value = 0;
        let res = await ky
            .post(uploadUrl, {
                json: {
                    _method: "search",
                    type: type.value,
                    group: group,
                    s: e.target.value,
                },
            })
            .json();
        if (res.data) mediaList.value = res.data;
        console.log(res.data);
    } else {
        await getData(type.value);
    }
}, 500);
</script>

<style scoped>
.active {
    color: black !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.galleryRef svg {
    fill: none !important;
}
</style>
