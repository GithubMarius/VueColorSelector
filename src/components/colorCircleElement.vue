<script setup>
import { defineProps, onMounted } from 'vue';
import {deleteSelf, onHover, unHoverAll} from './colorUtils'

const props = defineProps(['color', 'colors'])

onMounted(() => {
  })
</script>

<template>
    <div ref="colorCircleRef"
    :class="{hovered: props.color.hovered, selected: (props.color.selected || props.color.selecting)}"
    :style="{ left: props.color.xPos + 'px', top: props.color.yPos + 'px', backgroundColor: props.color.rgba}"
    @click.stop="deleteSelf(props)"
    @mouseover="onHover(props)"
    @mouseleave="unHoverAll(props)"
    class="colorCirlce"></div>
</template>

<style>
 .colorCirlce {
    min-height: 30px;
    min-width: 30px;
    position: absolute;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(0,0,0,.3);
    border-width: 2px;
    border-style: solid;
}
</style>