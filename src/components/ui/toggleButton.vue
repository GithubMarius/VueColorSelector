<script setup>
defineProps(['modelValue', 'icons'])
defineEmits(['update:modelValue'])
const icons = ["bi-eye-fill", "bi-eye-slash"]
</script>

<template>
  <label class="btn bi" :class="[modelValue ? icons[0] + ' btn-primary': icons[1] + ' btn-outline-primary']">
    <input style="display:none" type="checkbox" autocomplete="off" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)">
  </label>
</template>