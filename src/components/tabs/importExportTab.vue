<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { return_download_file, openDataImportFileDialog } from '@/utils/fileManagement';
import cardContainer from '@/components/ui/cardContainer.vue'
import switchButton from '@/components/ui/switchButton.vue'
import formGroup from '@/components/ui/formGroup.vue'



const settingsStore = useSettingsStore()

function onImgFileChange(event){
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {
    //Set the Base64 string return from FileReader as source.
    settingsStore.url = <string>e.target.result;
  }
}

</script>

<template>

  
  <cardContainer>
    <template #header>
      Export/Import Settings
    </template>
    <template #content>
      <formGroup :label="settingsStore.exportSettings.export_images.label">
        <switchButton v-model="settingsStore.exportSettings.export_images.value"></switchButton>
      </formGroup>
      <formGroup :label="settingsStore.exportSettings.import_images.label">
        <switchButton v-model="settingsStore.exportSettings.import_images.value"></switchButton>
      </formGroup>
    </template>
  </cardContainer>
  
  <cardContainer>
    <template #header>
      Open Image/Export/Import
    </template>
    <template #content>
      <div class="row m-2">
        <input type="file" class="form-control" @change="onImgFileChange">

      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="return_download_file">Export colors{{ (settingsStore.exportSettings.export_images.value) ? ' & Images' : '' }}</button>
      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="openDataImportFileDialog">Import colors{{ (settingsStore.exportSettings.import_images.value) ? ' & Images' : '' }}</button>
      </div>
    </template>
  </cardContainer>
</template>