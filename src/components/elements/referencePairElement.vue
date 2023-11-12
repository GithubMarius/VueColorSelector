<script setup lang="ts">
import {computed, ref, StyleValue} from 'vue';
import SelectableElement from '@/components/elements/SelectableElement.vue';
import {ReferencePair} from "@/utils/tools/reference_tool";
import {useToolsStore} from "@/stores/tools";
import {deleteReferencePairAction} from "@/actions/referenceactions";

const toolsStore = useToolsStore()

const props = defineProps({
  pair: {
    type: ReferencePair || Object
  }
})

const styleDigital = computed(function (): StyleValue {
  const xy = props.pair.center
  return <StyleValue>{
    left: xy[0] + 'px',
    top: xy[1] + 'px',
    width: props.pair.width + 'px',
    transform: 'translate(-50%, -50%) rotate(' + props.pair.angle + 'rad)'
  }
})

const styleReal = computed(function (): StyleValue {
  const xy = props.pair.center_scaled
  return <StyleValue>{
    left: xy[0] + 'px',
    top: xy[1] + 'px',
    width: props.pair.length_scaled + 'px',
    transform: 'translate(-50%, -50%) rotate(' + props.pair.angle + 'rad)'
  }
})

</script>

<template>
  <SelectableElement v-model:selecting="pair.selecting" v-model:selected="pair.selected" :active="toolsStore.tools.referenceTool.state.active"
                     @delete="deleteReferencePairAction.create(pair)"
  >
    <hr class="pairline pairline_digital" :class="{'pairline_select': pair.highlighted,
    'pe-none': toolsStore.tools.referenceTool.dragged_point
    }" :style="styleDigital">
  </SelectableElement>
</template>

<style>
.pairline {
  position: absolute;
  margin: 0;
  border-top: 3px solid;
  opacity: 1;
}

.pairline_select {
  border-top: 6px solid;
}

.pairline_digital {
  border-color: var(--bs-primary);
}

.pairline_real {
  border-color: var(--bs-secondary);
}
</style>