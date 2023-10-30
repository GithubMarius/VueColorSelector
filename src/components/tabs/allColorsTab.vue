<script setup lang="ts">

import ColorBlockElement from '@/components/elements/ColorBlockElement.vue'

import { useColorStore } from '@/stores/color';
const colorStore = useColorStore()

</script>


<template>
    <span>
        <ColorBlockElement v-for="(color, index) in colorStore.colors" :key="index" :color="color"></ColorBlockElement>
    </span>
</template>