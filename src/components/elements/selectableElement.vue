<script setup lang="ts">
import {computed, useAttrs} from "vue";
import {mouseStatesComposable} from "@/composables/mouse";

const props = defineProps({
  selecting: {},
  selected: {},
  active: {},
  shiftIcon: {
    default: 'url(src/assets/icons/plus-slash-minus.svg) 8 8, cell',
    type: String
  },
  altIcon: {
    default: 'default',
    type: String
  },
  cmdIcon: {
    default: 'url(src/assets/icons/eraser.svg) 4 14, cell',
    type: String
  },
})

const emit = defineEmits(['update:selecting', 'update:selected', 'delete', 'clicked', 'altClicked'])
defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const attrsActive =  computed(() => (props.active) ? attrs : filter_attrs())

function filter_attrs() {
  Object.entries(attrs).filter(([_, value]) => {
    return (!(value instanceof Function || ((value instanceof Array && value.length > 0 && value[0] instanceof Function))))
  })
}

function update_selecting(event: CustomEvent) {
  if (props.active) {
    emit('update:selecting', event.detail)
  }
}

function update_selected() {
  if (props.active && props.selecting) {
    emit('update:selected', true)
  }
}

function toggle_selected() {
  if (props.active) {
    emit('update:selected', !props.selected)
  }
}
function drop_from_selection() {
  if (props.active) {
    emit('update:selected', false)
  }
}

const { shift, alt, cmd } = mouseStatesComposable()
</script>

<template>
<span class="selectable"
      :class="{
        'selectable-active': active,
        'selectable-shift': shift && active,
        'selectable-alt': alt && active,
        'selectable-cmd': cmd && active,
      }"
      @mouseup.left.capture.exact="emit('clicked', $event)"
      @mouseup.left.alt.capture.exact.stop="emit('altClicked')"
      @mouseup.ctrl.left.capture.exact.stop="emit('delete', $event)"
      @mouseup.left.shift.capture.exact.stop="toggle_selected"
      @selecting="update_selecting"
      @toselection="update_selected"
      @fromselection="drop_from_selection"
      v-bind="attrsActive"
>
<slot></slot>
</span>
</template>

<style>
.selectable-active {
  cursor: pointer;
}
.selectable-shift {
  cursor: v-bind(shiftIcon);
}
.selectable-alt {
  cursor: v-bind(altIcon);
}
.selectable-cmd {
  cursor: v-bind(cmdIcon);
}
</style>