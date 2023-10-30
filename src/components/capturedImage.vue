<script setup lang="ts">
import { useCamImageStore } from '@/stores/camImageStore';
import { useSettingsStore } from '@/stores/settings';
import { computed, onMounted, ref } from 'vue';

const settingsStore = useSettingsStore()
const camImageStore = useCamImageStore()

const CapturedImageStyle = computed(() => {
    const img = camImageStore.active_image
    const offSetTranslation = (settingsStore.preview_mode.value) ? 'translateY(-50%)' : ` translate(${img.offSetX}px, ${img.offSetY}px)`
    return {
        top: (settingsStore.preview_mode.value) ? '50%' : '0px',
        transform: `translate(-50%, 0%)${offSetTranslation} scale(${img.scale.value}) rotate(${img.angle.css_angle})`
    }
})

const mounted = ref(false)

onMounted(() => {
    mounted.value = true
})

</script>

<template>
    <Teleport to="#canvasColumn" :disabled="<any>settingsStore.split_mode.value" v-if="mounted">
        <div class="captured-image-container">
            {{ camImageStore.activated_image_exists }}
            {{  !settingsStore.captureVideo.value }}
            {{  camImageStore.activated_image_exists && !settingsStore.captureVideo.value }}
            <img :src="camImageStore.active_image.imgUrl" :style="CapturedImageStyle" v-if="camImageStore.activated_image_exists && !settingsStore.captureVideo.value">
        </div>
    </Teleport>
</template>

<style scoped>
img {
    position: absolute;
    left: 50%;
}

.captured-image-container {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>