<script setup lang="ts">

import colorBlockElement from '../elements/colorBlockElement.vue'
import selectableElement from '../elements/selectableElement.vue'
defineProps(['colors'])

import { useColorStore } from '../../stores/color';
const color = useColorStore()


</script>


<template>
<selectableElement>
    <colorBlockElement v-for="(color, index) in color.colors" :key="index" :color="color"></colorBlockElement>
</selectableElement>
</template>