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

function drag(event) {
    const isoriginal = Boolean(event.target.dataset.isoriginal)
    const isstart = Boolean(event.target.dataset.isstart)
    if (isoriginal && isstart) {
        console.log(event)
        console.log([event.clientX, event.clientY])
        props.referencePair.digital.start = [event.clientX, event.clientY]
    }
}

</script>

<template>
<div>
    <div ref="start" class="reference_point rounded" data-isoriginal="true" data-isstart="true" :style="styleStart" @drag="drag"></div>
    <hr class="reference_line" :style="{left: referencePair.digital.cssCenterX, top: referencePair.digital.cssCenterY,  transform: referencePair.digital.cssTransform, width: referencePair.digital.cssLength}">
    <div ref="end" class="reference_point rounded" :style="styleEnd">
</div>
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
    position: absolute;
    margin: 0px;
    height: 2px;
    opacity: 1;
    color: var(--col-pri);
    background-color: var(--col-pri);
}
</style>