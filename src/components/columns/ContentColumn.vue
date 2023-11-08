<script setup lang="ts">
// Stores
import {useSettingsStore} from '@/stores/settings'
import ImageCanvas from '../ImageCanvas.vue';
import CapturedImage from "@/components/CapturedImage.vue";
import CaptureCamera from "@/components/CaptureCamera.vue";

const settingsStore = useSettingsStore()

</script>

<template>
  <div class="col">
    <div class="row image-containing-row">
      <div class="col overflow-auto vh-100">
        <!-- Image canvas -->
        <ImageCanvas></ImageCanvas>
      </div>
      <div class="col overflow-auto vh-100" :hidden="<boolean>!settingsStore.ui.split_mode.value">
        <!-- captured image -->
        <CapturedImage></CapturedImage>
        <!-- video capture-->
        <CaptureCamera></CaptureCamera>
      </div>
    </div>

  </div>
</template>

<style scoped>
.image-containing-row div {
  position: relative;
  min-height: 100vh;
  padding: 0;
}

.image-containing-row div:nth-child(2) {
  position: relative;
  padding: 0;
  border-left: rgba(var(--bs-dark-rgb), 0.6) solid 4px;
}
</style>