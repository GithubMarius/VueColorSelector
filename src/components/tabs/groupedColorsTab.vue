<script setup lang="ts">
import colorGroupElement from '../elements/colorGroupElement.vue'
const props = defineProps(['groups'])
</script>


<template>
<colorGroupElement v-for="(group, index) in groups" :key="index" :group="group"></colorGroupElement>
</template>