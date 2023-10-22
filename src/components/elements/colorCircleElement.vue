<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Color } from '@/utils/colors/ColorManagement';
import { useSettingsStore } from '@/stores/settings';
import { useColorStore } from '@/stores/color';
import { useHistoryStore } from '@/stores/history'
import selectableElement from '@/components/elements/selectableElement.vue'

const colorStore = useColorStore()
const historyStore = useHistoryStore()


const props = defineProps({
  color: {
    type: Color
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
      @click.ctrl.stop="historyStore.delete_color(color)"
      @click.shift.stop="color.selected = !color.selected"
      @mouseover="colorStore.color_hover(color)"
      @mouseleave="colorStore.color_unhover_all()"
      class="color_circle" :data-color-id="colorStore.color_index(color)"></div>
  </selectableElement>
</template>

<style scoped>
 .color_circle {
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(0,0,0,.3);
    border-width: 2px;
    border-style: solid;
}
</style>