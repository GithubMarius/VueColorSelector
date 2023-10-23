<script setup lang="ts">
import { Color } from '@/utils/colors/ColorManagement';
import { StyleValue, computed } from 'vue';

const props = defineProps({
    color: Color
})

const style = computed(() => {
    console.log(props.color.RGB)
    return { 'background-color': props.color.css_rgb }
})

</script>

<template>
    <div class="color-viewer-element" :style="style">
        Test
    </div>

</template>

<style scoped>
.color-viewer-element {
    position: absolute;
    width: 10px;
    height: 10px;
    transform: translate(-50%, -50%)
}
</style>
