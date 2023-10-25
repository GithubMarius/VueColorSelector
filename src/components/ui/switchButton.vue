<script setup>
/* Example usage:
<toggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
*/

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

</script>

<template>
  <span class="form-switch">
      <input class="form-check-input" type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)" role="switch">
  </span>
</template>