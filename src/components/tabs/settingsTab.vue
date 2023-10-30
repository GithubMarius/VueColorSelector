<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings';
import formGroup from '@/components/ui/FormGroup.vue';
import SwitchButton from '@/components/ui/SwitchButton.vue'
import AutoForm from '../ui/AutoForm.vue';

const settings = useSettingsStore()



</script>

<template>
<CardContainer>
  <template #header>
    UI
  </template>
  <template #content>
    <formGroup :label="settings.light.label">
        <SwitchButton v-model="settings.light.value"></SwitchButton>
    </formGroup>
    <formGroup :label="settings.split_mode.label">
        <SwitchButton v-model="settings.split_mode.value"></SwitchButton>
    </formGroup>
    <AutoForm v-model="settings.color_circle_radius"></AutoForm>
    <AutoForm v-model="settings.reference_circle_radius"></AutoForm>
  </template>
</CardContainer>
<CardContainer>
  <template #header>
    Image
  </template>
  <template #content>
    <formGroup :label="settings.color_mode.label">
      <SwitchButton v-model="settings.color_mode.value"></SwitchButton>
    </formGroup>
    <AutoForm v-model="settings.opacity"></AutoForm>
    </template>
</CardContainer>


</template>
  