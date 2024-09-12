<template>
    <div class="flex flex-col">
        <div class="sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div>
                    <table
                        class="min-w-full text-left text-sm font-light text-surface dark:text-white"
                        v-if="mediaList.length"
                    >
                        <thead
                            class="border-b border-neutral-200 font-medium dark:border-white/10"
                        >
                            <tr>
                                <th scope="col" class="p-2 text-left">Файл</th>
                                <th scope="col" class="p-2 text-left">Имя</th>
                                <th scope="col" class="p-2 text-left">Дата</th>
                                <th scope="col" class="p-2 text-left">Тип</th>
                                <th scope="col" class="p-2 text-left">
                                    Размер (orig.)
                                </th>
                                <th scope="col" class="p-2 text-left">
                                    W x H (orig.)
                                </th>
                                <th scope="col" class="p-2 text-left">
                                    Sizes/Ver
                                </th>
                                <th scope="col" class="p-2 text-left">
                                    Locales
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, i) in mediaList"
                                class="border-b border-neutral-200 dark:border-white/10 font-normal text-base"
                            >
                                <td class="p-2">
                                    <Image
                                        :item="item"
                                        init-class="w-full h-full max-w-[75px]"
                                        wrapper-class="max-w-[75px]"
                                        alt=""
                                    />
                                </td>
                                <td class="p-2">
                                    {{ item.filename }}
                                </td>
                                <td class="p-2">
                                    {{ getDate(item.createdAt) }}
                                </td>
                                <td class="p-2">
                                    {{ fileType(item) }}
                                </td>
                                <td class="p-2">
                                    {{ (item.size / 1024 / 1024).toFixed(4) }}
                                    Mb
                                </td>
                                <td class="p-2">
                                    {{ imageSize(item.meta) }}
                                </td>
                                <td class="p-2">
                                    <template v-if="item.variants.length">
                                        <p v-for="variant in item.variants">
                                            <span
                                                v-if="
                                                    imagesTypes.has(
                                                        item.mimeType,
                                                    )
                                                "
                                            >
                                                {{ imageSize(variant.meta) }}
                                            </span>
                                            <span v-else>
                                                <template
                                                    v-if="
                                                        /^ver:/.test(
                                                            variant.tag,
                                                        )
                                                    "
                                                >
                                                    {{ variant.tag }}
                                                </template>
                                            </span>
                                        </p>
                                    </template>
                                    <span v-else>---</span>
                                </td>
                                <td class="p-2">
                                    <template v-if="item.variants.length">
                                        <p v-for="item in item.variants">
                                            <span
                                                v-if="/^loc:/.test(item.tag)"
                                                >{{
                                                    item.tag.replace("loc:", "")
                                                }}</span
                                            >
                                        </p>
                                    </template>
                                    <span v-else>---</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TableL",
};
</script>

<script setup>
import Image from "./Image.vue";

const props = defineProps(["mediaList"]);
const imagesTypes = new Set([
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
]);

function getDate(t) {
    let date = new Date(t);
    return date.toLocaleDateString();
}

function imageSize(meta) {
    let size = meta.find((e) => e.key === "imageSizes");
    if (size) {
        return `${size.value.width}x${size.value.height}`;
    } else {
        return "---";
    }
}

function fileType(item) {
    return item.url.split(/[#?]/)[0].split(".").pop().trim();
}
</script>

<style scoped></style>
