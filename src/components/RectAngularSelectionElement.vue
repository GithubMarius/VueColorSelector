<script lang="ts" setup>
import { ref, watch, defineProps, defineExpose } from 'vue'

const props = defineProps(['startSelection', 'endSelection', 'active', 'colors'])

watch(() => props.startSelection, (newStart, _) => {
    // Set selection start
    topLeftCorner.value = newStart
})
watch(() => props.endSelection, (newEnd, _) => {
    // Update selection and rectangle if selection end is updated
    calculateLeftandTop(newEnd)
    calculateWidthandHeight(newEnd)
    update_selection()
})

/* watch(() => props.active, (value, _) => {
    if (!value) {
        // Unselect all colors if tool status changes to inactive
        props.colors.forEach(color => color.selected = false)
    }
}) */

function calculateLeftandTop(newEnd) {
    // Calculate position of selection rectangle
  topLeftCorner.value=[Math.min(props.startSelection[0], newEnd[0]), Math.min(props.startSelection[1], newEnd[1])]
}

function calculateWidthandHeight(newEnd) {
    // Calculate width and height of selection rectangle
    bottomRightCorner.value = [Math.max(props.startSelection[0], newEnd[0]), Math.max(props.startSelection[1], newEnd[1])];
    widthHeight.value = [bottomRightCorner.value[0] - topLeftCorner.value[0], bottomRightCorner.value[1] - topLeftCorner.value[1]];
}

function update_selection() {
    // Highlight points within selection
    props.colors.forEach(color => {
        color.selecting = color.visible && is_color_in_bounds(color)
    })
}

function manifest_selection() {
    props.colors.forEach(color => {
        if (color.selecting) {
            color.selected = true
        }
        color.selecting = false
    })
}

defineExpose({manifest_selection})

function is_color_in_bounds(color) {
    // Check if position of color (point) is within selection bounds
    return is_color_in_xbounds(color) && is_color_in_ybounds(color) 
}

function is_color_in_xbounds(color) {
    // Check if position of color (point) is within selection xbounds
    return (topLeftCorner.value[0] < color.xPos) && (color.xPos < bottomRightCorner.value[0])
}

function is_color_in_ybounds(color) {
    // Check if position of color (point) is within selection ybounds
    return (topLeftCorner.value[1] < color.yPos) && (color.yPos < bottomRightCorner.value[1])
}

const topLeftCorner = ref([0,0])
const bottomRightCorner = ref([0,0])
const widthHeight = ref([0,0])

const rectAngularSelectionRef = ref(0)
</script>

<template>
<div ref="rectAngularSelectionRef" class="rect_angular_selection"
:style="{display: (!active) ? 'none' : 'block',left: topLeftCorner[0] + 'px', top: topLeftCorner[1] + 'px', width: widthHeight[0] + 'px', height: widthHeight[1] + 'px'}"></div>
</template>

<style>
.rect_angular_selection {
    position: absolute;
    background-color: None;
    border: 1px dashed black;
}
</style>