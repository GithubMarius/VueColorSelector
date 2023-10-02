<script setup>
import { ref, watch, defineProps } from 'vue'

const props = defineProps(['startSelection', 'endSelection'])

watch(() => props.startSelection, (newStart, _) => {
    topLeftCorner.value = newStart
})
watch(() => props.endSelection, (newEnd, _) => {
    topLeftCorner.value = [Math.min(props.startSelection[0], newEnd[0]), Math.min(props.startSelection[1], newEnd[1])]
    const bottomRightCorner = [Math.max(props.startSelection[0], newEnd[0]), Math.max(props.startSelection[1], newEnd[1])]
    widthHeight.value = [bottomRightCorner[0]-topLeftCorner.value[0], bottomRightCorner[1]-topLeftCorner.value[1]]
    console.log(widthHeight.value)
})


const active = ref(true)
const topLeftCorner = ref([0,0])
const widthHeight = ref([0,0])

const rectAngularSelectionRef = ref(0)
</script>

<template>
<div ref="rectAngularSelectionRef" class="rect_angular_selection"
:style="{left: topLeftCorner[0] + 'px', top: topLeftCorner[1] + 'px', width: widthHeight[0] + 'px', height: widthHeight[1] + 'px'}"></div>
</template>

<style>
.rect_angular_selection {
    position: absolute;
    background-color: None;
    border: 1px dashed black;
}
</style>