<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import formGroup from '@/components/ui/FormGroup.vue';
import SwitchButton from '@/components/ui/SwitchButton.vue'
import AutoForm from '../ui/AutoForm.vue';

const settingsStore = useSettingsStore()

</script>

<template>
<CardContainer>
  <template #header>
    UI
  </template>
  <template #content>
    <formGroup :label="settingsStore.ui.light.label">
        <SwitchButton v-model="settingsStore.ui.light.value"></SwitchButton>
    </formGroup>
    <formGroup :label="settingsStore.ui.split_mode.label">
        <SwitchButton v-model="settingsStore.ui.split_mode.value"></SwitchButton>
    </formGroup>
    <AutoForm v-model="settingsStore.ui.color_circle_radius"></AutoForm>
    <AutoForm v-model="settingsStore.ui.reference_circle_radius"></AutoForm>
  </template>
</CardContainer>
<CardContainer>
  <template #header>
    Image
  </template>
  <template #content>
    <formGroup :label="settingsStore.color_mode.label">
      <SwitchButton v-model="settingsStore.color_mode.value"></SwitchButton>
    </formGroup>
    <AutoForm v-model="settingsStore.ui.opacity"></AutoForm>
    <AutoForm v-model="settingsStore.ui.scale"></AutoForm>
    </template>
</CardContainer>


</template>
  