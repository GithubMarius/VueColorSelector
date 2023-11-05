<script setup lang="ts">
const props = defineProps(['selecting', 'selected', 'active'])
const emit = defineEmits(['update:selecting', 'update:selected'])

function update_selecting(event) {
  if (props.active) {
    emit('update:selecting', event.detail)
  }
}

function update_selected() {
  if (props.active && props.selecting) {
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
      @selecting="update_selecting"
      @toselection="update_selected"
      @fromselection="drop_from_selection"
>
<slot></slot></span>
</template>