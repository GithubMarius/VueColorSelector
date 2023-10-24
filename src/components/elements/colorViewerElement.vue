<script setup lang="ts">
import { Color } from '@/utils/colors/ColorManagement';
import selectableColor from '@/components/elements/selectableColor.vue'
import { StyleValue, computed } from 'vue';

const props = defineProps({
    color: Color,
    pos: {}
})

const style = computed(() => {
    return <StyleValue><unknown>{
        'background-color': props.color.css_rgb,
        left: props.pos[0] + 'px',
        top: props.pos[1] + 'px',
        width: (props.color.show_details) ? '40px' : '20px',
        height: (props.color.show_details) ? '40px' : '20px',
        zIndex: (props.color.show_details) ? '2' : '1',
        borderWidth: (props.color.show_details) ? '4px' : '1px',
        borderRadius: get_border_radius(),
        transform: get_transform(),
    }
})

function get_transform() {
    return (props.pos[2] === 0) ?  `translate(-50%, -50%) rotate(45deg)` : `translate(-50%, -95%) rotate(45deg) scale(${1-Math.abs(props.pos[2]*0.8)})`
}

function get_border_radius() {
    if (props.pos[2] > 0) {
        return '30% 30% 0% 30%'
    } else if (props.pos[2] < 0) {
        return '50% 50% 0% 50%'
    } else {
        return '50% 50% 50% 50%'
    }
}
</script>

<template>
  <selectableColor :color="color" v-model:selecting="color.selectingColorViewer" v-if="color.visible">
        <div class="color-viewer-element" :style="style"
            :class="{'highlighted': color.highlighted}"
        >
        </div>
  </selectableColor>
</template>

<style scoped>
.color-viewer-element {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid;
}

</style>
