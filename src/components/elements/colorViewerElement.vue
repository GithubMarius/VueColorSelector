<script setup lang="ts">
import { Color } from '@/utils/colors/ColorManagement';
import selectableColor from '@/components/elements/selectableColor.vue'
import { StyleValue, computed } from 'vue';

const props = defineProps({
    color: Color,
    pos: {}
})

const style_container = computed(() => {
    return <StyleValue><unknown> {
        color: props.color.css_rgb,
        left: props.pos[0] + 'px',
        top: props.pos[1] + 'px',
        width: (props.color.show_details) ? '40px' : '20px',
        height: (props.color.show_details) ? '40px' : '20px',
        fontSize: (props.color.show_details) ? '40px' : '20px',
        zIndex: (props.color.show_details) ? '2' : '1',
        transform: get_transform(),
    }
})

function get_transform() {
    return (props.pos[2] < 0) ?  `translate(-50%, -50%) rotate(180deg) scale(${1-Math.abs(props.pos[2]*0.8)}` : `translate(-50%, -50%) scale(${1-Math.abs(props.pos[2]*0.8)})`
}

function get_not_selected_icon_class() {
    if (props.pos[2] !== 0) {
        return 'bi-triangle-fill'
    } else {
        return 'bi-square-fill'
    }
}

function get_selected_icon_class() {
    if (props.pos[2] !== 0) {
        return 'bi-triangle'
    } else {
        return 'bi-square'
    }
}
</script>

<template>
  <selectableColor :color="color" v-model:selecting="color.selectingColorViewer" v-if="color.visible">
        <div class="color-viewer-element bi" :style="style_container"
            :class="[{'highlighted': color.highlighted}]"
        >
            <div class="bi icon" :class="get_not_selected_icon_class()"></div>
            <div class="bi icon" :class="get_selected_icon_class()" :style="{color: (color.highlighted) ? 'var(--color-highlighted)' : 'black'}"></div>
        </div>
  </selectableColor>
</template>

<style scoped lang="scss">


.color-viewer-element {
    position: absolute;
}

.icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
