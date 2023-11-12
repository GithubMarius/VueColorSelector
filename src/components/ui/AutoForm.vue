<script setup>
import {AutoFormProperty} from '@/utils/properties';
import FormGroup from './FormGroup.vue';
import {mergeProps, useAttrs} from 'vue'

const props = defineProps({
  modelValue: {
    type: AutoFormProperty
  },
  shown_in_group: {
    type: Boolean,
    default: true
  }
})
defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()

const mergedProps = mergeProps(attrs, props.modelValue.props)

defineEmits(['update:modelValue'])

</script>

<template>
  <FormGroup :label="modelValue.label" v-if="shown_in_group">
    <component :is="modelValue.form_component" v-model="modelValue.value" v-bind="mergedProps"></component>
  </FormGroup>
  <component :is="modelValue.form_component" v-model="modelValue.value" v-bind="mergedProps"
             v-if="!shown_in_group">
  </component>
</template>