<script setup lang="ts">

import colorBlockElement from '../elements/colorBlockElement.vue'
import selectableElement from '../elements/selectableElement.vue'
defineProps(['colors'])



</script>


<template>
<selectableElement>
    <colorBlockElement v-for="(color, index) in colors" :key="index" :color="color"></colorBlockElement>
</selectableElement>
</template>