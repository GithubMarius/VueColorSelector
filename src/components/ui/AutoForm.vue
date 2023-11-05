<script setup>
import {AutoFormProperty} from '@/utils/properties';
import FormGroup from './FormGroup.vue';


const props = defineProps({
  modelValue: {
    type: AutoFormProperty
  },
  shown_in_group: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

</script>

<template>
  <FormGroup :label="modelValue.label" v-if="shown_in_group">
    <component :is="modelValue.form_component" v-model="modelValue.value" v-bind="modelValue.props"></component>
  </FormGroup>
  <component :is="modelValue.form_component" v-model="modelValue.value" v-bind="modelValue.props"
             v-if="!shown_in_group">
  </component>
</template>