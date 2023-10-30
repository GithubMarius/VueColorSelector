<script setup>
/* Example usage:
<SwitchButton v-model="pair.visible"></ToggleButton>
*/

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

</script>

<template>
  <span class="form-switch">
      <input class="form-check-input" type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)" role="switch">
  </span>
</template>