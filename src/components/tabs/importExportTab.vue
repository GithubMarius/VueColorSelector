<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings'
import {onImgFileChange, openDataImportFileDialog, return_download_file} from '@/utils/fileManagement';
import SwitchButton from '@/components/ui/SwitchButton.vue'
import formGroup from '@/components/ui/FormGroup.vue'


const settingsStore = useSettingsStore()

</script>

<template>

  <CardContainer>
    <template #header>
      Export/Import Settings
    </template>
    <template #content>
      <formGroup :label="settingsStore.exportSettings.export_images.label">
        <SwitchButton v-model="settingsStore.exportSettings.export_images.value"></SwitchButton>
      </formGroup>
      <formGroup :label="settingsStore.exportSettings.import_images.label">
        <SwitchButton v-model="settingsStore.exportSettings.import_images.value"></SwitchButton>
      </formGroup>
    </template>
  </CardContainer>

  <CardContainer>
    <template #header>
      Open Image/Export/Import
    </template>
    <template #content>
      <div class="row m-2">
        <input type="file" class="form-control" @change="onImgFileChange">

      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="return_download_file">Export
          colors{{ (settingsStore.exportSettings.export_images.value) ? ' & Images' : '' }}
        </button>
      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="openDataImportFileDialog">Import
          colors{{ (settingsStore.exportSettings.import_images.value) ? ' & Images' : '' }}
        </button>
      </div>
    </template>
  </CardContainer>
</template>