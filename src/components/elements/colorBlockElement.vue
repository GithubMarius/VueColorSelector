<script setup lang="ts">
import { ref, defineProps, onMounted, computed, watch, Ref, inject, StyleValue } from 'vue'
import { Color } from '@/utils/colors/ColorManagement';
import selectableElement from '@/components/elements/selectableElement.vue'
import { useSettingsStore } from '@/stores/settings';
import { useColorStore } from '@/stores/color';


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
const settings = useSettingsStore()


const colorBlockRef = ref(null)
/*
const check_group = computed(() => {
  return props.show_all || ((props.color.group.length === 0) && !props.group_name) || (props.color.group === props.group_name)
  // return props.show_all || ((props.color.group.length === 0) && !props.group_name) || (props.color.group === props.group_name)
  // return ((props.color.group.length === 0) && !props.group_name) || props.color.group.includes(props.group_name)
})
*/
onMounted(() => {
  })
</script>

<template>
<selectableElement v-model:selecting="color.selectingBlock" v-model:selected="color.selected">
<div ref="colorBlockRef" class="color_block"


:class="{highlighted: ($props.color.hovered || props.color.selected || props.color.selecting)}"
:style="<StyleValue>{backgroundColor: <StyleValue>[settings.color_mode ? props.color.css_rgb : props.color.css_bw_hsl]}"
@click.ctrl="colorStore.color_delete(color)"
@mouseover="colorStore.color_hover(color)"
@mouseleave="colorStore.color_unhover_all()"
:data-color-id="colorStore.color_index(color)"
></div>
</selectableElement>
</template>

<style>
.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(0,0,0,0);
}
</style>