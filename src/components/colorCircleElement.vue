<script setup lang="ts">
import { Ref, defineProps, onMounted, ref } from 'vue';
import { deleteSelf, onHover, unHoverAll } from './colorUtils'
import { Color } from './color';
import Settings from './settings';

const props = defineProps({
  color: {
    type: Color
  },
  colors: {
    type: Array<Color>
  },
  settings: {
    type: Settings
  }
})


onMounted(() => {
  })
</script>

<template>
    <div ref="colorCircleRef" v-if="props.color.visible"
    :class="{hovered: props.color.hovered, selected: (props.color.selected || props.color.selecting)}"
    :style="{
      left: props.color.css_xPos, top: props.color.css_yPos, backgroundColor: props.color.css_rgb,
      minWidth: props.settings.css_circle_diameter, minHeight: props.settings.css_circle_diameter
    }"
    @click.ctrl.stop="deleteSelf(props)"
    @click.shift.stop="color.selected = !color.selected"
    @mouseover="onHover(props)"
    @mouseleave="unHoverAll(props)"
    class="color_circle" :data-color-id="color.index"></div>
</template>

<style>
 .color_circle {
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(0,0,0,.3);
    border-width: 2px;
    border-style: solid;
}
</style>