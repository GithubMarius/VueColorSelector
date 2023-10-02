<script setup>
import { ref, watch, defineProps, onMounted } from 'vue'
import {deleteSelf, onHover, unHoverAll} from './colorUtils'

const props = defineProps(['color', 'colors'])
const colorBlockRef = ref(0)
const key=ref(0)

onMounted(() => {
  })
</script>

<template>
<div ref="colorBlockRef" class="color_block"
:class="{hovered: props.color.hovered}"
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
  border: 5px solid rgba(0,0,0,0);
}

.hovered {
  border-color: rgba(0,0,0,0.2) !important;
}
</style>