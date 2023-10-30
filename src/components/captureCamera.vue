<script setup lang="ts">
import { useCamImageStore } from '@/stores/camImageStore';
import { useSettingsStore } from '@/stores/settings';
import { onMounted, ref, watch } from 'vue';

const settingsStore = useSettingsStore()

const loadedMetaData = ref(false)

watch(() => settingsStore.captureVideo.value, (_prev, _next) => {
    if (settingsStore.captureVideo.value && !videoRef.value.srcObject) {
        startVideo()
        if (!settingsStore.ui.hide_settings_column.value) {
            settingsStore.ui.opacity.value = 0.5
        }
    } else {
        stopVideo()
    }
})

const videoRef = ref()

function startVideo(){
    var All_mediaDevices=navigator.mediaDevices
    if (!All_mediaDevices || !All_mediaDevices.getUserMedia) {
        console.log("getUserMedia() not supported.");
        throw new Error('No camera found.')
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
                console.log(e.name + ": " + e.message)
            });
}

function takeImage(){
    // Take image from current video
    const video = videoRef.value
    var canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const camImageStore = useCamImageStore()
    camImageStore.add_image_from_url(canvas.toDataURL())
}

function stopVideo() {
    const video = videoRef.value
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
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
    <Teleport to="#canvasColumn" :disabled="!settingsStore.ui.hide_settings_column.value" v-if="mounted">
        <video ref="videoRef" id="video" :hidden="!settingsStore.captureVideo"></video>
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
</style>