<script setup lang="ts">
import { onMounted, computed, inject, ref } from 'vue';
import { referenceTool } from './Tool'

const props = defineProps(['reference'])

const settings: any = inject('settings')

onMounted(() => {console.log(props)
    console.log(settings)
    console.log(settings.value)
})
const size_circle = computed(function(){return {
    width: settings.value.reference_circle_radius * 2 + 'px',
    height: settings.value.reference_circle_radius * 2 + 'px'
}})


const styleStart = computed(function(){return Object.assign({
    left: props.reference.cssStartX,
    top: props.reference.cssStartY
}, size_circle.value)})

const styleEnd = computed(function(){return Object.assign({
    left: props.reference.cssEndX,
    top: props.reference.cssEndY
}, size_circle.value)})

const styleReal = computed(function(){return Object.assign({
    left: props.reference.cssRealX,
    top: props.reference.cssRealY
}, size_circle.value)})

</script>

<template>
<div>
    <hr class="reference_line" :style="{left: reference.cssCenterX, top: reference.cssCenterY,  transform: reference.cssTransform, width: reference.cssLength}">
    <div ref="start" class="reference_point point rounded" @mousedown.left.prevent="referenceTool.update_call = reference.start_from_event" :style="styleStart"></div>
    <div ref="end" class="reference_point point rounded" @mousedown.left.prevent="reference.getting_draged = reference.end_from_event" :style="styleEnd"></div>
    <div ref="real" class="reference_point point rounded" @mousedown.left.prevent="reference.getting_draged = reference.scale_from_event"  :style="styleReal"></div>
</div>


</template>
<style>
.point {
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

.point:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

.reference_point {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: var(--col-pri);
    transform: translate(-50%, -50%);
}

.reference_point:hover {
    cursor: 'grabbing';
}

.reference_line {
    position: absolute;
    margin: 0px;
    height: 2px;
    opacity: 1;
    color: var(--col-pri);
    background-color: var(--col-pri);
}
</style>