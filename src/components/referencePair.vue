<script setup lang="ts">
import { StyleValue, computed } from 'vue';
import { Pair } from './Tool'

const props = defineProps({
  pair: {
    type: Pair
  }
})

const styleDigital = computed(function(): StyleValue {
    const xy = props.pair.center_org
    return <StyleValue>{
        left: xy[0] + 'px',
        top: xy[1] + 'px',
        width: props.pair.length_org + 'px',
        transform: 'translate(-50%, -50%) rotate(' + props.pair.angle + 'rad)'
    }
})

const styleReal = computed(function(): StyleValue {
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
        <hr class="pairline pairline_digital" :style="styleDigital" v-if="pair.visible">
        <hr class="pairline pairline_real" :style="styleReal" v-if="pair.visible">
</template>

<style>
.pairline {
    position: absolute;
    margin: 0px;
    border-top: 2px dashed ;
    opacity: 1;
}

.pairline_digital {
    border-color: var(--col-pri);
}

.pairline_real {
    border-color: var(--col-reference-scaled);
}
</style>