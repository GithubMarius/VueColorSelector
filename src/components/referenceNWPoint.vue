<script setup lang="ts">
import { StyleValue, computed, ref } from 'vue';
import { referenceTool, Point } from './Tool'

const props = defineProps({
  point: {
    type: Point
  },
  tool: {
    type: Object
  }
})

const styleDigital = computed(function(): StyleValue {
    const xy = props.point.get_org()
    return <StyleValue>{
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }
})

const styleReal = computed(function(): StyleValue {
    const xy = props.point.get_scaled()
    return <StyleValue>{
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }
})

</script>

<template>

    <div class="referencePoint referencePointDigital" :style="styleDigital"
    @mousedown.left.exact="() => {
        tool.lastActive = point
        tool.update_call = ($event) => {
        point.update_from_event($event)}
        }"
    @mousedown.left.shift="() => {
            tool.new_pair(point, tool.last_active)
            tool.last_active = point
    }"    
    @mousedown.stop
    ></div>
    <div class="referencePoint referencePointReal" :style="styleReal"
    @mousedown.left="tool.update_call = ($event) => point.scale_from_event($event)" @mousedown.stop
    v-if="tool.refPoint !== point"
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