<script setup lang="ts">

import colorBlockElement from '@/components/elements/colorBlockElement.vue'

import { useColorStore } from '@/stores/color';
const colorStore = useColorStore()

</script>


<template>
    <span>
        <colorBlockElement v-for="(color, index) in colorStore.colors" :key="index" :color="color"></colorBlockElement>
    </span>
</template>