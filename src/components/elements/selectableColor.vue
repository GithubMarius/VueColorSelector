<script setup lang="ts">
import {Color} from '@/utils/colors/ColorManagement';
import SelectableElement from './SelectableElement.vue';
import {useColorStore} from '@/stores/color'
import {useSettingsStore} from '@/stores/settings';
import {useToolsStore} from "@/stores/tools";
import {DeleteColorAction} from "@/actions/coloractions";

defineProps({
  color: {
    type: Color
  },
  selecting: {}
})

defineEmits([
  'update:selecting'
])

const settingsStore = useSettingsStore()

function update_show_details_color(color: Color) {
  colorStore.update_show_details(color)
  if (color.show_details) {
    settingsStore.set_chrOrSat(color)
  }

}

const colorStore = useColorStore()
const toolsStore = useToolsStore()

</script>

<template>
  <SelectableElement :selecting="selecting" @update:selecting="$emit('update:selecting', $event)"
                     v-model:selected="color.selected"
                     :active="toolsStore.tools.colorsTool.state.active"
                     @mouseup.ctrl.capture.stop="DeleteColorAction.create(color)"
                     @mouseup.shift.capture.stop="color.selected = !color.selected"
                     @mouseup.alt.capture.stop="update_show_details_color(color)"
                     @mouseover="colorStore.color_hover(color)"
                     @mouseleave="colorStore.color_unhover_all()"
                     :data-color-id="colorStore.color_index(color)">
    <slot></slot>
  </SelectableElement>
</template>