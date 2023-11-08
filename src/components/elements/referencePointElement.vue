<script setup lang="ts">
import {computed, ref, StyleValue} from 'vue';

import SelectableElement from '@/components/elements/SelectableElement.vue';
import {useSettingsStore} from '@/stores/settings';
import {combine} from '@/utils/general';
import {ReferencePoint} from "@/utils/tools/reference_tool";
import {useToolsStore} from "@/stores/tools";
import {useReferenceStore} from "@/stores/references";

const settings = useSettingsStore()
const toolsStore = useToolsStore()
const referenceStore = useReferenceStore()

const props = defineProps({
  point: {
    type: ReferencePoint || Object
  }
})


const styleDigital = computed(function (): StyleValue {
  const styleSize = {
    width: settings.ui.reference_circle_radius.value * 2 + Number(props.point.highlighted) * 5 + 'px',
    height: settings.ui.reference_circle_radius.value * 2 + Number(props.point.highlighted) * 5 + 'px'
  }
  const xy = props.point.coords
  return <StyleValue>combine({
    left: xy[0] + 'px',
    top: xy[1] + 'px'
  }, styleSize)
})

const styleReal = computed(function (): StyleValue {
  const xy = props.point.get_scaled()
  return <StyleValue>combine({
    left: xy[0] + 'px',
    top: xy[1] + 'px'
  }, settings.ui.reference_circle_radius.css_size)
})
</script>

<template>
  <SelectableElement v-model:selecting="point.selecting" v-model:selected="point.selected"
                     @mouseup.ctrl.exact="referenceStore.delete_point(point)"
                     @mousedown.exact="toolsStore.tools.referenceTool.dragged_point = point"
                     :active="toolsStore.tools.referenceTool.state.active">
    <div class="referencePoint" :style="styleDigital"></div>
  </SelectableElement>
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
  background-color: var(--bs-primary);
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
  -webkit-mask: var(--url-ref) no-repeat center !important;
  mask: var(--url-ref) no-repeat center !important;
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