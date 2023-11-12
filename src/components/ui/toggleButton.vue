<script setup>

import {computed} from 'vue'
/* Example usage:
<ToggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></ToggleButton>
*/

const props = defineProps({
  modelValue: {},
  icons: undefined,
  icon: {
    type: String
  },
  labels: undefined,
  label: {
    type: String
  },
  btnColor: {
    type: String,
    default: 'primary'
  },
  outlineOnly: {
    type: Boolean,
    default: false
  },
  filledOnly: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

function btn_style() {
  return ((!props.modelValue || props.outlineOnly) && !props.filledOnly ? 'btn-outline-' : 'btn-') + props.btnColor
}

const resolvedIcons = props.icon ? [props.icon, props.icon] : props.icons

const css_classes = computed(() => {
  if (resolvedIcons) {
    return 'bi ' + (props.modelValue ? resolvedIcons[0] + ' ' + btn_style() : resolvedIcons[1] + ' ' + btn_style())
  } else {
    return btn_style()
  }
})


const label = computed(() => {
  if (props.labels) {
    return props.modelValue ? props.labels[0] : props.labels[1]
  } else if (props.label) {
    return props.label
  }
})
</script>

<template>
  <label class="btn pe-auto" :class="css_classes">{{ label }}
    <input style="display:none" type="checkbox" autocomplete="off" :checked="modelValue"
           @input="$emit('update:modelValue', $event.target.checked)">
  </label>
</template>