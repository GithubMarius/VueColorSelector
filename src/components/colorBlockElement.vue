<script setup>
import { ref, defineProps, onMounted, computed } from 'vue'
import {deleteSelf, onHover, unHoverAll} from './colorUtils'

const props = defineProps(['color', 'colors', 'group_name', 'show_all'])
const colorBlockRef = ref(0)
const key=ref(null)

const check_group = computed(() => {
  console.log(props.color.group)
  console.log(props.group_name)
  return props.show_all || ((props.color.group.length === 0) && !props.group_name) || (props.color.group === props.group_name)
  // return props.show_all || ((props.color.group.length === 0) && !props.group_name) || (props.color.group === props.group_name)
  // return ((props.color.group.length === 0) && !props.group_name) || props.color.group.includes(props.group_name)
})

onMounted(() => {
  })
</script>

<template>
<div ref="colorBlockRef" class="color_block"
v-if="check_group"

:class="{hovered: props.color.hovered, selected: props.color.selected}"
:style="{backgroundColor: props.color.rgba}"
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