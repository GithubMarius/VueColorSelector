<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import {deleteSelf, onHover, unHoverAll} from './colorUtils'
import Color from './color';

const props = defineProps({
  color: {
    type: Color
  },
  colors: {
    type: Array<Color>
  }
})

onMounted(() => {
  })
</script>

<template>
    <div ref="colorCircleRef"
    :class="{hovered: props.color.hovered, selected: (props.color.selected || props.color.selecting)}"
    :style="{ left: props.color.css_xPos, top: props.color.css_yPos, backgroundColor: props.color.css_rgb}"
    @click.stop="deleteSelf(props)"
    @mouseover="onHover(props)"
    @mouseleave="unHoverAll(props)"
    class="colorCirlce"></div>
</template>

<style>
 .colorCirlce {
    min-height: 30px;
    min-width: 30px;
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(0,0,0,.3);
    border-width: 2px;
    border-style: solid;
}
</style>