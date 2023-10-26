<script setup>

import { computed } from 'vue'
/* Example usage:
<toggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
*/

const props = defineProps({
  modelValue: {},
  icons: undefined,
  labels: undefined
})

defineEmits(['update:modelValue'])

const css_classes = computed(() => {
  if (props.icons) {
    return 'bi ' + (props.modelValue ? props.icons[0] + ' btn-primary': props.icons[1] + ' btn-outline-primary')
  }
  else {
    return props.modelValue ? 'btn-primary' : 'btn-outline-primary'
  }
})


const label = computed(() => {
  if (props.labels) {
    return props.modelValue ? props.labels[0] : props.labels[1]
  }
})
</script>

<template>
  <label class="btn" :class="css_classes">{{ label }}
    <input style="display:none" type="checkbox" autocomplete="off" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)">
  </label>
</template>