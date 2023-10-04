<script setup lang="ts">
import Color, {ColorArray} from './color';
import {onMounted} from 'vue'

class settings {
    background_color: ColorArray = [0, 1, 2, 1]
    background_color_light: ColorArray = [0, 1, 2, 1]
}

onMounted(() => {
    console.log(Color)
})

</script>

<template>
</template>