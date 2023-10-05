<script setup lang="ts">
import { ref, defineProps, onMounted, computed, watch } from 'vue'
import {deleteSelf, onHover, unHoverAll} from './colorUtils'
import { Color } from './color';

const props = defineProps({
  color: {
    type: Color
  },
  visible: {
    type: Boolean,
    default: false
  }
})

watch(() => props.visible, (value, _) => {props.color.visible = value})

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
  <slot></slot>
<div ref="colorBlockRef" class="color_block"

:class="{hovered: props.color.hovered, selected: (props.color.selected || props.color.selecting)}"
:style="{backgroundColor: props.color.css_rgb}"
@click="deleteSelf(props)"
@mouseover="onHover(props)"
@mouseleave="unHoverAll(props)"
></div>
</template>

<style>
.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(0,0,0,0);
}

.hovered {
  border-color: rgba(0,0,0,0.7) !important;
}

.selected {
  border-color:  rgb(14, 137, 231) !important; 
}
</style>