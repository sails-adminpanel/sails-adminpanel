<template>
    <div class="grid grid-cols-[repeat(auto-fill,_150px)] gap-2 justify-start">
        <Image
            :item="item"
            v-for="item in mediaList"
            init-class="w-full h-full max-w-[150px]"
            wrapper-class="max-w-[150px]"
            alt=""
        />
    </div>
</template>

<script>
export default {
    name: "Tile",
};
</script>

<script setup>
import Image from "./Image.vue";
const props = defineProps(["mediaList"]);
</script>

<style scoped></style>
