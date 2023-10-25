<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings'
import { return_download_file, openDataImportFileDialog } from '@/utils/fileManagement';

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
    <div class="row m-2">
        <input type="file" class="form-control" @change="onImgFileChange">

      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="return_download_file">Export colors</button>
      </div>
      <div class="row m-2">
        <button class="btn btn-primary" @click="openDataImportFileDialog">Import colors</button>
      </div>
</template>