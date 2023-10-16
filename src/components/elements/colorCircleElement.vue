<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';
import { onHover, unHoverAll } from '../../utils/colorUtils'
import { Color } from '../color';
import { useSettingsStore } from '../../stores/settings';
import selectableElement from '../elements/selectableElement.vue'

const props = defineProps({
  color: {
    type: Color
  },
  colors: {
    type: Array<Color>
  }
})

const settings = useSettingsStore()

const style = computed(function(){ return {
        left: props.color.css_xPos, top: props.color.css_yPos, backgroundColor: settings.color_mode ? props.color.css_rgb : props.color.css_bw_hsl,
        minWidth: settings.color_circle_radius.css_diameter, minHeight: settings.color_circle_radius.css_diameter
      }})

onMounted(() => {
  })
</script>

<template>
  <selectableElement v-model:selecting="color.selectingCircle" v-model:selected="color.selected">
      <div ref="colorCircleRef" v-if="props.color.visible"
      :class="{highlighted: (props.color.hovered || props.color.selected || props.color.selecting)}"
      :style="style"
      @click.ctrl.stop="color.delete()"
      @click.shift.stop="color.selected = !color.selected"
      @mouseover="onHover(props)"
      @mouseleave="unHoverAll(props)"
      class="color_circle" :data-color-id="color.index"></div>
  </selectableElement>
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