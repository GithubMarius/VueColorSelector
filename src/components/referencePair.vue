<script setup lang="ts">
import { StyleValue, computed } from 'vue';
import { NWPair } from './Tool'

const props = defineProps({
  pair: {
    type: NWPair
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
        <hr class="pairline pairline_digital" :style="styleDigital">
        <hr class="pairline pairline_real" :style="styleReal">
</template>

<style>
.pairline {
    position: absolute;
    margin: 0px;
    height: 2px;
    opacity: 1;
}

.pairline_digital {
    color: var(--col-pri);
    background-color: var(--col-pri);
}

.pairline_real {
    color: yellow;
    background-color: green;
}
</style>