<script setup lang="ts">
import { useCamImageStore } from '@/stores/camImageStore';

const camImageStore = useCamImageStore()

</script>

<template>
    <img :src="camImageStore.active_image.imgUrl" v-if="camImageStore.activated_image_exists">
</template>

<style scoped>
img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>