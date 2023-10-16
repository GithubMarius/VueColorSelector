<script setup lang="ts">
import { inject } from 'vue';
import {useSettingsStore} from '../../stores/settings'

const settings = useSettingsStore()

function onFileChange(event){
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {

    //Set the Base64 string return from FileReader as source.
    console.log(settings)
    settings.url = <string>e.target.result;
  }
}

</script>

<template>
    <div class="row m-2">
        <input type="file" class="form-control" data-bs-theme="light"  @change="onFileChange">
      </div>
</template>