<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Color } from '@/utils/colors/ColorManagement';
import { useSettingsStore } from '@/stores/settings';
import { useColorStore } from '@/stores/color';
import { useHistoryStore } from '@/stores/history'
import selectableColor from './selectableColor.vue';

const colorStore = useColorStore()
const settings = useSettingsStore()


const props = defineProps({
  color: {
    type: Color
  }
})


const style = computed(function(){ return {
        left: props.color.css_xPos,
        top: props.color.css_yPos,
        backgroundColor: settings.color_mode.value ? props.color.css_rgb : settings.get_grayscaledColor(props.color),
        minWidth: settings.color_circle_radius.css_diameter,
        minHeight: settings.color_circle_radius.css_diameter,
        zIndex: (props.color.show_details) ? '2' : '1',
        transform: (props.color.show_details) ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%)',
      }})

onMounted(() => {
  })
</script>

<template>
  <selectableColor :color="color" v-model:selecting="color.selectingCircle">
      <div ref="colorCircleRef" v-if="props.color.visible"
      :class="{highlighted: color.highlighted}"
      :style="style"
      class="color_circle" :data-color-id="colorStore.color_index(color)"></div>
  </selectableColor>
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