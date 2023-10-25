<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings'
import { create_data_file, check_data_import_file_type, read_data_file } from '@/utils/fileManagement';

const settings = useSettingsStore()

function onImgFileChange(event){
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {
    //Set the Base64 string return from FileReader as source.
    settings.url = <string>e.target.result;
  }
}

function onDataFileChange(event) {

  if (check_data_import_file_type(event.target.files[0])) {
    read_data_file(event.target.files[0])
  }
  else {
    throw(new Error('Wrong file type.'))
  }

}


function return_download_file() {
  // Used example from https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
  const file = create_data_file()
  const link = document.createElement('a')
  const url = URL.createObjectURL(file)

  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
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
        <label class="btn btn-primary" for="import-data">Import colors (not implemented yet)</label>
        <input id="import-data" type='file' hidden @change="onDataFileChange"/>
      </div>
</template>