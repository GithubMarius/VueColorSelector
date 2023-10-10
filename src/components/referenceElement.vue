<script setup lang="ts">
import { onMounted, computed, inject } from 'vue';
import { Reference } from './Tool'

const props = defineProps(['referencePair'])

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
    left: props.referencePair.digital.cssStartX,
    top: props.referencePair.digital.cssStartY
}, size_circle.value)})

const styleEnd = computed(function(){return Object.assign({
    left: props.referencePair.digital.cssEndX,
    top: props.referencePair.digital.cssEndY
}, size_circle.value)})

const styleReal = computed(function(){return Object.assign({
    left: props.referencePair.digital.cssRealX,
    top: props.referencePair.digital.cssRealY
}, size_circle.value)})

function dragDigital(event) {
    if (event.target.dataset.isstart === 'true') {
        props.referencePair.digital.start_from_event(event, true)
    } else {
        props.referencePair.digital.end_from_event(event, true)
    }
}

function dragReal(event) {
    settings.value.scale = props.referencePair.digital.scale_from_event(event)
    console.log(props.referencePair.digital.scale_from_event(event))
}

function dragStart(event) {
}

function change_cursor(_, value: Boolean) {
}

</script>

<template>
<div>
    <div ref="start" class="reference_point rounded" data-isstart="true" @click.prevent @drag.prevent="dragDigital" @dragend="dragDigital" draggable="true" :style="styleStart" @dragover.prevent></div>
    <hr  class="reference_line" :style="{left: referencePair.digital.cssCenterX, top: referencePair.digital.cssCenterY,  transform: referencePair.digital.cssTransform, width: referencePair.digital.cssLength}">
    <div ref="end" class="reference_point rounded" data-isstart="false" @click.prevent @drag.prevent="dragDigital" @dragend="dragDigital" draggable="true" :style="styleEnd" @dragover.prevent></div>
    <div ref="real" class="reference_point rounded" @click.prevent @drag.prevent="dragReal" @dragend="dragReal" draggable="true" :style="styleReal" @dragover.prevent></div>
</div>


</template>
<style>
.reference_point {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: var(--col-pri);
    transform: translate(-50%, -50%);
}

.reference_line {
    pointer-events: none;
    position: absolute;
    margin: 0px;
    height: 2px;
    opacity: 1;
    color: var(--col-pri);
    background-color: var(--col-pri);
}
</style>