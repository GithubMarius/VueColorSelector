<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '../../stores/settings';
import formGroup from '../ui/formGroup.vue';
import switchButton from '../ui/switchButton.vue'
import cardContainer from '../ui/cardContainer.vue'


const rangeColorCircleRadiusRef = ref(null)
onMounted(() => {
    rangeColorCircleRadiusRef.value.value = settings.color_circle_radius
})

function update_color_circle_radius(event) {
  settings.color_circle_radius.value = event.target.value
}

const settings = useSettingsStore()




</script>

<template>
<cardContainer>
  <template #header>
    UI
  </template>
  <template #content>
    <formGroup :label="'Dark/Light Mode'">
        <switchButton v-model="settings.bright"></switchButton>
    </formGroup>
    <formGroup :label="'Circle Radius'">
      <input ref="rangeColorCircleRadiusRef" type="range" class="form-range" id="rangeColorCircleSize" @input="update_color_circle_radius" min="4" max="50">
    </formGroup>
    <formGroup :label="settings.reference_circle_radius.label">
        <input type="range" class="form-range" id="rangeReferenceCircleSize"
        @input="settings.reference_circle_radius.update_from_event"
        :value="settings.reference_circle_radius.value"
        :min="settings.reference_circle_radius.min" :max="settings.reference_circle_radius.max">
    </formGroup>
  </template>
</cardContainer>
<cardContainer>
  <template #header>
    Image
  </template>
  <template #content>
    <formGroup :label="'Color/BW Mode'">
      <switchButton v-model="settings.color_mode"></switchButton>
    </formGroup>
    <formGroup :label="settings.opacity.label">
        <input type="range" class="form-range" id="rangeReferenceCircleSize"
        @input="settings.opacity.update_from_event"
        :value="settings.opacity.value"
        :min="settings.opacity.min" :max="settings.opacity.max"
        :step="settings.opacity.step">
    </formGroup>
    </template>
</cardContainer>


</template>
  