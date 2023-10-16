<script setup>
/* Example usage:
<toggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
*/

defineProps(['modelValue', 'icons'])
defineEmits(['update:modelValue'])

</script>

<template>
  <label class="btn bi" :class="[modelValue ? icons[0] + ' btn-primary': icons[1] + ' btn-outline-primary']">
    <input style="display:none" type="checkbox" autocomplete="off" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)">
  </label>
</template>