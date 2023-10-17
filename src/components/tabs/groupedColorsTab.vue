<script setup lang="ts">
import colorGroupElement from '@/components/elements/colorGroupElement.vue'
import { useColorStore } from '@/stores/color'

// Stores
const color = useColorStore()
</script>


<template>
<colorGroupElement v-for="(group, index) in color.groups" :key="index" :group="<any>group"></colorGroupElement>
</template>