<script setup lang="ts">

import colorBlockElement from '@/components/elements/colorBlockElement.vue'
import selectableElement from '@/components/elements/selectableElement.vue'
defineProps(['colors'])

import { useColorStore } from '@/stores/color';
const colorStore = useColorStore()


</script>


<template>
<selectableElement>
    <colorBlockElement v-for="(color, index) in colorStore.colors" :key="index" :color="color"></colorBlockElement>
</selectableElement>
</template>