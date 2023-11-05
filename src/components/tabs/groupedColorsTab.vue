<script setup lang="ts">
import ColorGroupElement from '@/components/elements/ColorGroupElement.vue'
import {useColorStore} from '@/stores/color'
import formGroup from '@/components/ui/FormGroup.vue'
import ToggleGroup from '@/components/ui/ToggleGroup.vue'
import ToggleButton from '@/components/ui/ToggleButton.vue'
import {useSettingsStore} from '@/stores/settings'


// Stores
const settingsStore = useSettingsStore()
const colorStore = useColorStore()

</script>

<template>
  <CardContainer>
    <template #header>
      <span class="fs-5">Preferences</span>
    </template>
    <template #content>
      <formGroup :label="settingsStore.colorsSortBy.label">
        <ToggleGroup v-model="settingsStore.colorsSortBy.value"
                     :options="settingsStore.colorsSortBy.options"></ToggleGroup>
      </formGroup>
      <formGroup :label="'Color order'">
        <ToggleButton v-model="settingsStore.colorsOrderAscending.value"
                      :icons="['bi-arrow-up-right', 'bi-arrow-down-right']"
                      :labels="[' Ascending', ' Descending']"></ToggleButton>
      </formGroup>
    </template>
  </CardContainer>
  <ColorGroupElement v-for="(group, index) in colorStore.groups" :key="index" :group="<any>group"></ColorGroupElement>
</template>