<script setup lang="ts">
import { Ref, StyleValue, computed, inject, ref } from 'vue';
import { referenceTool, Point } from './Tool'
import Settings from './settings';
import { combine } from './utils';

const props = defineProps({
  point: {
    type: Point
  },
  tool: {
    type: Object
  }
})

const settings: Ref<Settings> = inject('settings')

const styleDigital = computed(function(): StyleValue {
    const xy = props.point.get_org()
    return <StyleValue>combine({
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }, settings.value.reference_circle_radius.css_size)
})

const styleReal = computed(function(): StyleValue {
    const xy = props.point.get_scaled()
    return <StyleValue>combine({
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }, settings.value.reference_circle_radius.css_size)
})

</script>

<template>
    <div class="user-select-none referencePoint referencePointDigital"
    :class="{
        active_point: point===tool.last_active,
        'deletable grabbable': tool.active,
        referencePointRef: point===tool.refPoint
    }"
    :style="styleDigital"
    @mousedown.left.exact="() => {
        if (tool.active) {
            tool.last_active = point
            tool.update_call = ($event) => {point.update_from_event($event)}
        }
    }"
    @mousedown.left.shift="() => {
        if (tool.active) {
        tool.connect_existing_points(point, tool.last_active)
        tool.last_active = point
        }
    }"
    @mousedown.left.ctrl="() => {
        if (tool.active) {
            tool.remove_point(point)
        }
    }"
    @mousedown.stop
    @dragstart.prevent
    ></div>
    <div class="user-select-none referencePoint referencePointReal" :style="styleReal"
    @mousedown.left="tool.update_call = ($event) => point.scale_from_event($event)"
    @mousedown.stop
    @dragstart.prevent
    :class="{ 'grabbable': tool.active }"
    v-if="tool.refPoint !== point"
    ></div>

</template>

<style>
:root {
    --url-org: url(src/assets/icons/x.svg);
    --url-scaled: url(src/assets/icons/x.svg);
    --url-active: url(src/assets/icons/x-circle.svg);
    --url-ref: url(src/assets/icons/x-circle-fill.svg);
}

.referencePoint {
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
}

.referencePointDigital {
    background-color: var(--col-reference-org);
    -webkit-mask: var(--url-org) no-repeat center;
    mask: var(--url-org) no-repeat center cover;
    -webkit-mask-size: cover;
    mask-size: cover;
}

.referencePointReal {
    background-color: var(--col-reference-scaled);
    -webkit-mask: var(--url-scaled) no-repeat center;
    mask: var(--url-scaled) no-repeat center;
    -webkit-mask-size: cover;
    mask-size: cover;
}

.referencePointRef {
    -webkit-mask:  var(--url-ref) no-repeat center !important;
    mask:  var(--url-ref) no-repeat center !important;
    -webkit-mask-size: cover !important;
    mask-size: cover !important;
}

.active_point {
    background-color: var(--col-pri) !important;
    -webkit-mask: var(--url-active) no-repeat center;
    mask: var(--url-active) no-repeat center;
    opacity: 1;
    -webkit-mask-size: cover;
    mask-size: cover;
}

.grabbable {
    cursor: move;
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
    -webkit-mask-size: cover;
    mask-size: cover;
}
</style>