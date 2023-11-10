<script setup lang="ts">
import {computed, useAttrs} from "vue";

const props = defineProps(['selecting', 'selected', 'active'])
const emit = defineEmits(['update:selecting', 'update:selected'])
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

function add_to_selection() {
  if (props.active) {
    emit('update:selected', true)
  }
}
function drop_from_selection() {
  if (props.active) {
    emit('update:selected', false)
  }
}
</script>

<template>
<span class="selectable"
      @click.left.shift.exact="add_to_selection"
      @selecting="update_selecting"
      @toselection="update_selected"
      @fromselection="drop_from_selection"
      v-bind="attrsActive"
>
<slot></slot>
</span>
</template>