<script setup lang="ts">
import { ref, defineProps, onMounted, computed, watch, Ref, inject, StyleValue } from 'vue'
import { Color } from '@/utils/colors/ColorManagement'
import selectableElement from '@/components/elements/selectableElement.vue'
import { useSettingsStore } from '@/stores/settings'
import { useColorStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history'


const props = defineProps({
  color: {
    type: Color
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const colorStore = useColorStore()
const historyStore = useHistoryStore()
const settings = useSettingsStore()


const colorBlockRef = ref(null)

onMounted(() => {
  })
</script>

<template>
<selectableElement v-model:selecting="color.selectingBlock" v-model:selected="color.selected">
<div ref="colorBlockRef" class="color_block"


:class="{highlighted: ($props.color.hovered || props.color.selected || props.color.selecting)}"
:style="<StyleValue>{backgroundColor: <StyleValue>[settings.color_mode ? props.color.css_rgb : props.color.css_bw_hsl]}"
@click.ctrl="historyStore.delete_color(color)"
@mouseover="colorStore.color_hover(color)"
@mouseleave="colorStore.color_unhover_all()"
:data-color-id="colorStore.color_index(color)"
></div>
</selectableElement>
</template>

<style scoped>
.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(0,0,0,0);
}
</style>