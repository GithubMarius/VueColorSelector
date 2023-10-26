<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { ref, watch } from 'vue';

const settingsStore = useSettingsStore()

const loadedMetaData = ref(false)

const props = defineProps(['captureVideo'])
defineEmits(['update:captureVideo'])

watch(() => props.captureVideo, (_prev, _next) => {
    if (props.captureVideo && !loadedMetaData.value) {
        openCam()
        settingsStore.opacity.value = 0.5
    } else if (props.captureVideo) {
        videoRef.value.play()
    } else {
        videoRef.value.pause()
    }
})

const videoRef = ref()

function openCam(){
    var All_mediaDevices=navigator.mediaDevices
    if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
        console.log("getUserMedia() not supported.");
        return;
    }
    All_mediaDevices.getUserMedia({
        audio: false,
        video: true
        })
        .then(function(vidStream) {
            var video = <HTMLVideoElement>videoRef.value;

        if ("srcObject" in video) {
            video.srcObject = vidStream;
        } else {
            (<any>video).src = window.URL.createObjectURL(<any>vidStream);
        }
        video.onloadedmetadata = function(_) {
            loadedMetaData.value = true
            video.play()
        };
        })
        .catch(function(e) {
            console.log(e.name + ": " + e.message);
        });
    }



defineExpose({
    openCam
})
</script>

<template>
  <video ref="videoRef" id="video" :hidden="!captureVideo"></video>
</template>

<style>
#video {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 100%;
    max-height: 100%;
}
</style>