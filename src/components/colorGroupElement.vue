<script setup>
import colorBlockElement from './colorBlockElement.vue'

import { ref, watch } from 'vue'

const props = defineProps({
    'colors': Array,
    'group_name': String,
    show_all:{
        type: Boolean,
        default: false
    }})

</script>

<template>
    <h5 v-if="(group_name)">{{ group_name }}</h5>
    <div>
        <colorBlockElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors" :group_name="group_name" :show_all="show_all"></colorBlockElement>
    </div>
</template>