<script setup lang="ts">
import {useCamImageStore} from '@/stores/camimages';
import {useSettingsStore} from '@/stores/settings';
import {computed, onMounted, ref} from 'vue';

const settingsStore = useSettingsStore()
const camImageStore = useCamImageStore()

const CapturedImageStyle = computed(() => {
  const img = camImageStore.active_image
  const offSetTranslation = (settingsStore.ui.hide_settings_column.value) ? 'translateY(-50%)' : ` translate(${img.offSetX}px, ${img.offSetY}px)`
  return {
    top: (settingsStore.ui.hide_settings_column.value) ? '50%' : '0px',
    transform: `translate(-50%, 0%)${offSetTranslation} scale(${img.scale.value}) rotate(${img.angle.css_angle})`
  }
})

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

</script>

<template>
  <!-- <any>settingsStore.ui.split_mode.value -->
  <Teleport to="#canvas-container" :disabled="<any>settingsStore.ui.split_mode.value" v-if="mounted">
    <div class="captured-image-container"
         v-if="camImageStore.activated_image_exists && !settingsStore.captureVideo.value">
      <img :src="camImageStore.active_image.imgUrl" :style="CapturedImageStyle">
    </div>
  </Teleport>
</template>

<style scoped>
img {
  position: absolute;
  top: 0;
  left: 50%;
}

.captured-image-container {
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>