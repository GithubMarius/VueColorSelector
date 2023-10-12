<script setup lang="ts">
import { StyleValue, computed, ref } from 'vue';
import { referenceTool, Point } from './Tool'

const props = defineProps(['point', 'tool'])

const styleDigital = computed(function(): StyleValue {
    return <StyleValue>{
        left: (<Point>props.point).coord_x.digital.toString(),
        top: (<Point>props.point).coord_y.digital.toString()
    }
})

const styleReal = computed(function(): StyleValue {
    return <StyleValue>{
        left: (<Point>props.point).coord_x.real.toString(),
        top: (<Point>props.point).coord_y.real.toString()
    }
})

</script>

<template>

    <div class="referencePoint referencePointDigital" :style="styleDigital"
    @mousedown.left="
        tool.update_call = ($event) => {
        point.update_from_event($event)}" @mousedown.stop></div>
    <div class="referencePoint referencePointReal" :style="styleReal" v-if="tool.points[0] !== point "
    @mousedown.left="tool.update_call = ($event) => point.scale_from_event($event)" @mousedown.stop
    
    ></div>

</template>

<style>
.referencePoint {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

.referencePointDigital {
    background-color: red;
    border: solid 2px blue;
}

.referencePointReal {
    border: solid 2px green;
}
</style>