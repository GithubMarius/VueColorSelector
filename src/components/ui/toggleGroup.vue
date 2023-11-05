<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: String
  },
  options: {
    type: Array
  }
})

const emits = defineEmits(['update:modelValue'])

function update_from_event(event) {
  const selected = props.options[event.target.dataset.value]
  emits('update:modelValue', selected)
}

</script>

<template>
  <div class="btn-group" role="group" aria-label="Basic radio toggle button group" @input="update_from_event($event)">
    <template v-for="(option, index) in options">
      <input type="radio" class="btn-check" :data-value="index" name="btnradio" autocomplete="off" :id="<string>option"
             :checked="option===modelValue">
      <label class="btn btn-outline-primary" :for="<string>option">{{ option }}</label>
    </template>
  </div>
</template>
