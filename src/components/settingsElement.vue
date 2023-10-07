<script setup lang="ts">
import {Color, ColorArray} from './color';
import {onMounted, ref} from 'vue'
import "bootstrap-icons/font/bootstrap-icons.css";
import Settings from './settings';

const props = defineProps({
  settings: {
    type: Settings
  }
})

const rangeColorCircleRadiusRef = ref(null)
onMounted(() => {
    rangeColorCircleRadiusRef.value.value = props.settings.color_circle_radius
})

function toggle_theme(event) {
  props.settings.bright = event.target.checked
}

function update_circle_radius(event) {
  props.settings.color_circle_radius = event.target.value
}

</script>

<template>
<form>
  <div class="form-group row">
    <label for="switchTheme" class="col-sm-4 col-form-label">Dark/Light mode</label>
    <div class="col-sm-8 m-auto">
      <span class="form-switch">
          <input class="form-check-input" type="checkbox" @input="toggle_theme" role="switch" id="switchTheme" checked>
      </span>
    </div>
  </div>
  <div class="form-group row">
    <label for="rangeColorCircleSize" class="col-sm-4 col-form-label">Circle radius</label>
    <div class="col-sm-8 m-auto">
      <input ref="rangeColorCircleRadiusRef" type="range" class="form-range" id="rangeColorCircleSize" @input="update_circle_radius" min="4" max="50">
    </div>
  </div>
</form>
</template>