<script setup>
import { defineEmits } from 'vue';

/* Example usage:
<ToggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></ToggleButton>
*/

const props = defineProps({
  modelValue: {},
  min: {
    default: 0
  },
  max: {
    default: 100
  },
  step: {
    default: 1
  }
})

const emits = defineEmits(['update:modelValue'])

function update_from_event(event) {
  emits('update:modelValue', event.target.value)
}

</script>

<template>
    <input type="range" class="form-range"
    @input="update_from_event"
    :value="modelValue"
    :min="min" :max="max"
    :step="step">
</template>

