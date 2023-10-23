<script setup lang="ts">
import { StyleValue, computed, ref } from 'vue';
import { Pair } from '../Tool'
import SelectableElement from './selectableElement.vue';

const props = defineProps({
  pair: {
    type: Pair
  },
  tool: {
    type: Object
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

const selecting = ref(false)
const selected = ref(false)

</script>

<template>
    <selectableElement v-model:selecting="selecting" v-model:selected="selected">
        <hr class="pairline pairline_digital" :class="{'pairline_select': selecting}" :style="styleDigital" v-if="pair.visible && tool.show_digital">
    </selectableElement>
    <hr class="pairline pairline_real" :style="styleReal" v-if="pair.visible && tool.show_real">
</template>

<style>
.pairline {
    position: absolute;
    margin: 0px;
    border-top: 3px solid ;
    opacity: 1;
}
.pairline_select {
    border-top: 4px solid;
}

.pairline_digital {
    border-color: var(--bs-primary);
}

.pairline_real {
    border-color: var(--bs-secondary);
}
</style>