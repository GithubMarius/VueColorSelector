<script setup lang="ts">
import { Color } from '@/utils/colors/ColorManagement';
import SelectableElement from './SelectableElement.vue';
import { useColorStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings';

defineProps({
    color: {
        type: Color
    },
    selecting: {
    }
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
const historyStore = useHistoryStore()
const colorStore = useColorStore()

</script>

<template>
<SelectableElement :selecting="selecting" @update:selecting="$emit('update:selecting', $event)" v-model:selected="color.selected"
    @click.ctrl.stop="historyStore.delete_color(color)"
    @click.shift.stop="color.selected = !color.selected"
    @click.alt.exact="update_show_details_color(color)"
    @mouseover="colorStore.color_hover(color)"
    @mouseleave="colorStore.color_unhover_all()"
    :data-color-id="colorStore.color_index(color)">
    <slot></slot>
</SelectableElement>
</template>