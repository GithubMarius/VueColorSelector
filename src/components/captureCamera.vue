<script setup lang="ts">
import {useCamImageStore} from '@/stores/camimages';
import {useSettingsStore} from '@/stores/settings';
import {onMounted, ref, watch} from 'vue';

const settingsStore = useSettingsStore()
const camImageStore = useCamImageStore()

const loadedMetaData = ref(false)

watch(() => settingsStore.captureVideo.value, (_prev, _next) => {
  if (settingsStore.captureVideo.value && !videoRef.value.srcObject) {
    startVideo()
    if (!settingsStore.ui.split_mode.value) {
      settingsStore.ui.opacity.value = 0.5
    }
  } else {
    stopVideo()
  }
})

const videoRef = ref()

function startVideo() {
  const All_mediaDevices = navigator.mediaDevices
  if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
    console.log("getUserMedia() not supported.");
    throw new Error('No camera found.')
  }
  All_mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
      .then(function (vidStream) {
        const video = <HTMLVideoElement>videoRef.value;
        if ("srcObject" in video) {
          video.srcObject = vidStream;
        } else {
          (<any>video).src = window.URL.createObjectURL(<any>vidStream);
        }

        video.onloadedmetadata = function (_) {
          loadedMetaData.value = true
          video.play()
        };
      })
      .catch(function (e) {
        console.log(e.name + ": " + e.message)
      });
}

function takeImage() {
  // Take image from current video
  const video = videoRef.value
  const canvas = document.createElement('canvas');
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  camImageStore.add_image_from_url(canvas.toDataURL())
}

function stopVideo() {
  const video = videoRef.value
  const stream = video.srcObject;
  if (stream) {
    const tracks: MediaStreamTrack[] = stream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      track.stop();
    });
  }

  video.srcObject = null;
}


defineExpose({
  openCam: startVideo,
  takeImage
})

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

</script>

<template>
  <Teleport to="#canvas-container-wrapper" :disabled="<boolean>settingsStore.ui.split_mode.value" v-if="mounted">
    <video ref="videoRef" id="video" :hidden="!settingsStore.captureVideo"></video>
    <transition name="fade">
      <div id="flash" v-if="camImageStore.flash"></div>
    </transition>
  </Teleport>
</template>

<style>
#video {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}

#flash {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
</style>