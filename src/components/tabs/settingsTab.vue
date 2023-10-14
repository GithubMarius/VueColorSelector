<script setup lang="ts">
import {Color, ColorArray} from '../color';
import {onMounted, PropType, ref, Ref} from 'vue'
import Settings from '../settings';

const props = defineProps({
  settings: {
    type: Object as PropType<Settings & Ref>
  }
})

const rangeColorCircleRadiusRef = ref(null)
onMounted(() => {
    rangeColorCircleRadiusRef.value.value = props.settings.color_circle_radius
})

function toggle_theme(event) {
  props.settings.bright = event.target.checked
}

function toggle_color_mode(event) {
  props.settings.color_mode = event.target.checked
}

function update_color_circle_radius(event) {
  props.settings.color_circle_radius = event.target.value
}

</script>

<template>
<form>
  <div class="form-group row">
    <label for="switchTheme" class="col-sm-4 col-form-label">Dark/Light Mode</label>
    <div class="col-sm-8 m-auto">
      <span class="form-switch">
          <input class="form-check-input" type="checkbox" @input="toggle_theme" role="switch" id="switchTheme" checked>
      </span>
    </div>
  </div>
  <div class="form-group row">
    <label for="switchColorMode" class="col-sm-4 col-form-label">Color/BW Mode</label>
    <div class="col-sm-8 m-auto">
      <span class="form-switch">
          <input class="form-check-input" type="checkbox" @input="toggle_color_mode" role="switch" id="switchColorMode" checked>
      </span>
    </div>
  </div>
  <div class="form-group row">
    <label for="rangeColorCircleSize" class="col-sm-4 col-form-label">Circle radius</label>
    <div class="col-sm-8 m-auto">
      <input ref="rangeColorCircleRadiusRef" type="range" class="form-range" id="rangeColorCircleSize" @input="update_color_circle_radius" min="4" max="50">
    </div>
  </div>
  <div class="form-group row">
    <label for="rangeReferenceCircleSize" class="col-sm-4 col-form-label">{{ settings.reference_circle_radius.label }}</label>
    <div class="col-sm-8 m-auto">
      <input type="range" class="form-range" id="rangeReferenceCircleSize"
      @input="settings.reference_circle_radius.update_from_event"
      :value="settings.reference_circle_radius.value"
      :min="settings.reference_circle_radius.min" max="settings.reference_circle_radius.max">
    </div>
  </div>
</form>
</template>