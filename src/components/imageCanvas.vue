<script setup lang="ts">
import {computed, nextTick, onMounted, ref, toRaw, watch} from 'vue';

import {useColorStore} from '@/stores/color';
import {useSettingsStore} from '@/stores/settings';
import ColorCircleElement from '@/components/elements/ColorCircleElement.vue';
import ReferencePairElement from '@/components/elements/ReferencePairElement.vue';
import ReferencePointElement from '@/components/elements/ReferencePointElement.vue';
import {useReferenceStore} from "@/stores/references";

const canvasElement = ref(null)
const canvasElementBW = ref(null)

const ctx = ref(null)
const ctxBW = ref(null)
const settings = useSettingsStore()
const colorStore = useColorStore()
const referenceStore = useReferenceStore()

watch(
    () => settings.url,
    (newUrl, _) => {
      console.log(newUrl)
      console.log(document.getElementById('canvas'))
      console.log(ctx.value)
      showImage(newUrl)
    })

watch(
    () => settings.color_mode.value,
    (_value, _) => {
      drawImage()
    }
)

const width = ref(0)
const height = ref(0)

const canvasContainerStyle = computed(() => {
  return {
    width: (width.value !== 0) ? width.value * settings.ui.scale.value + 'px' : '100%',
    height: (height.value !== 0) ? width.value * settings.ui.scale.value + 'px' : '100%',
    transform: `scale(${settings.ui.scale.value})`
  }
})


function showImage(url: string) {
  // Open image from url
  const image = new Image()

  //Validate the File Height and Width.
  image.onload = drawImage

  //Set the Base64 string return from FileReader as source.
  image.src = url
}

const canvasStyle = computed(() => {
  return {
    opacity: settings.ui.opacity.value
  }
})

function set_canvas_dimensions(image: HTMLImageElement) {
  width.value = image.width
  height.value = image.height

  canvasElement.value.width = image.width
  canvasElement.value.height = image.height

  canvasElementBW.value.width = image.width
  canvasElementBW.value.height = image.height
}

function drawImage(this: HTMLImageElement) {
  set_canvas_dimensions(this)
  drawImageInColor(this)
  drawImageInBw(this)
  return true
}

function drawImageInColor(image: HTMLImageElement) {
  ctx.value.drawImage(image, 0, 0);
}

function drawImageInBw(image: HTMLImageElement) {
  // Draw b/w image
  ctxBW.value.drawImage(image, 0, 0);
  ctxBW.value.fillStyle = '#FFF';
  ctxBW.value.fillRect(0, 0, image.width, image.height);
  ctxBW.value.globalCompositeOperation = 'luminosity';
  ctxBW.value.drawImage(image, 0, 0);
}

onMounted(() => {
  ctx.value = canvasElement.value.getContext('2d', {willReadFrequently: true})
  ctxBW.value = canvasElementBW.value.getContext('2d')
  showImage(settings.url)
})
</script>

<template>
  <div id="canvas-container-wrapper">
    <div id="canvas-container"
         @contextmenu.prevent
         :style="canvasContainerStyle">
      <canvas id="canvasBW" ref="canvasElementBW" class="canvas canvasBW" :style="canvasStyle"
              :class="{'d-none': settings.color_mode.value}"></canvas>
      <canvas id="canvas" ref="canvasElement" class="canvas" :style="canvasStyle"
              :class="{'opacity-0': !settings.color_mode.value}"></canvas>

      <!-- Circles, reference points and reference lines-->
      <ColorCircleElement v-for="(color, index) in colorStore.colors" :key="index" :color="color"></ColorCircleElement>
      <ReferencePointElement v-for="(refPoint, _) in referenceStore.points" :point="refPoint"></ReferencePointElement>
      <ReferencePairElement v-for="(refPair, _) in referenceStore.pairs" :pair="refPair"></ReferencePairElement>
    </div>
  </div>
</template>

<style scoped>

#canvas-container-wrapper {
  position: relative;
  margin: auto;
  width: fit-content;
  height: fit-content;
}

#canvas-container {
  position: relative;
  margin: auto;
  width: fit-content;
  height: fit-content;
  transform-origin: top left;
  z-index: 5;
}

#canvas-container div {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvasBW {
  position: absolute;
  pointer-events: none;
}

</style>