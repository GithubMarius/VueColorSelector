<script setup lang="ts">
import { StyleValue, computed, ref } from 'vue';
import { Point } from '@/utils/Tools'
import SelectableElement from '@/components/elements/SelectableElement.vue';
import { useSettingsStore } from '@/stores/settings';
import { combine } from '@/utils/general';

const settings = useSettingsStore()

const props = defineProps({
  point: {
    type: Point
  },
  tool: {
    type: Object
  }
})


const styleDigital = computed(function(): StyleValue {
    const styleSize = {
        width: settings.ui.reference_circle_radius.value * 2 + Number(selecting.value || selected.value) * 5 + 'px',
        height: settings.ui.reference_circle_radius.value * 2 + Number(selecting.value || selected.value) * 5 + 'px'
    }
    const xy = props.point.get_org()
    return <StyleValue>combine({
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }, styleSize)
})

const styleReal = computed(function(): StyleValue {
    const xy = props.point.get_scaled()
    return <StyleValue>combine({
        left: xy[0] + 'px',
        top: xy[1] + 'px'
    }, settings.ui.reference_circle_radius.css_size)
})

const selecting = ref(false)
const selected = ref(false)
</script>

<template>
    <SelectableElement v-model:selecting="selecting" v-model:selected="selected">
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
    v-if="tool.show_digital"
    ></div>
    </SelectableElement>
    <div class="user-select-none referencePoint referencePointReal" :style="styleReal"
    @mousedown.left="tool.update_call = ($event) => point.scale_from_event($event)"
    @mousedown.stop
    @dragstart.prevent
    :class="{ 'grabbable': tool.active }"
    v-if="(tool.refPoint !== point) && tool.show_real"
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
    background-color: var(--bs-primary);
    -webkit-mask: var(--url-org) no-repeat center;
    mask: var(--url-org) no-repeat center cover;
    -webkit-mask-size: cover;
    mask-size: cover;
}

.referencePointReal {
    background-color: var(--bs-secondary);
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
    background-color: var(--bs-primary) !important;
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