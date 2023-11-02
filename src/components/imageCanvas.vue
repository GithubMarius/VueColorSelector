<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useColorStore } from '@/stores/color';
import { useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import ColorCircleElement from '@/components/elements/ColorCircleElement.vue';
import referencePair from '@/components/elements/ReferencePairElement.vue';
import referencePoint from '@/components/elements/ReferencePointElement.vue';

const canvasElement = ref(null)
const canvasElementBW = ref(null)

const selection_tool_active = ref(false)

const image = ref(null)
const ctx = ref(null)
const ctxBW = ref(null)
const settings = useSettingsStore()
const colorStore = useColorStore()

watch(
    () => settings.url,
      (newUrl, _) => {
        showImage(newUrl)
     }, {
    immediate: true,
    deep: true,
 })

watch(
    () => settings.color_mode.value,
      (_value, _) => {
        drawImage()
     }
)

const canvasContainerStyle = computed(() => {
    return {
        transform: `transformX(-50%) scale(${settings.ui.scale.value})`
    }
})


const canvasStyle = computed(() => {
    return {
        opacity: settings.ui.opacity.value
    }
})

function showImage(url: string) {
    // Open image from url
    image.value = new Image()

    //Set the Base64 string return from FileReader as source.
    image.value.src = url

    //Validate the File Height and Width.
    image.value.onload = drawImage
}
function set_canvas_dimensions() {
    canvasElement.value.width = image.value.width
    canvasElement.value.height = image.value.height

    canvasElementBW.value.width = image.value.width
    canvasElementBW.value.height = image.value.height
}

function drawImage() {
    set_canvas_dimensions()
    drawImageInColor()
    drawImageInBw()
    return true
}

function drawImageInColor() {
    ctx.value.drawImage(image.value, 0, 0);    
}

function drawImageInBw() {
    // Draw b/w image
    ctxBW.value.drawImage(image.value, 0, 0);
    ctxBW.value.fillStyle = '#FFF';
    ctxBW.value.fillRect(0, 0, image.value.width, image.value.height);
    ctxBW.value.globalCompositeOperation = 'luminosity';
    ctxBW.value.drawImage(image.value, 0, 0);
}


function add_color_element(event) {
    // If currently not using a selection tool
    // TODO: Check if timestamp could be removed
    const historyStore = useHistoryStore()
    historyStore.add_color(event)
}

onMounted(() => {
    showImage(settings.url)
    ctx.value = canvasElement.value.getContext('2d', { willReadFrequently: true })
    ctxBW.value = canvasElementBW.value.getContext('2d')
    })
</script>

<template>
    <div id="canvas-container"
            @contextmenu.prevent
            @click.left.exact="add_color_element"
        :style="canvasContainerStyle">
        <canvas id="canvasBW" ref="canvasElementBW" class="canvas canvasBW" :style="canvasStyle" :class="{'d-none': settings.color_mode.value}"></canvas>
        <canvas id="canvas" ref="canvasElement" class="canvas" :style="canvasStyle" :class="{'opacity-0': !settings.color_mode.value}" ></canvas>
        <ColorCircleElement v-for="(color, index) in colorStore.colors" :key="index" :color="color">
        </ColorCircleElement>
        
        <!--
        <referencePair v-for="(pair, index) in referenceToolRef.pairs" :key="index" :pair="pair" :tool="referenceToolRef">
        </referencePair>
        <referencePoint v-for="(point, index) in referenceToolRef.points" :key="index" :point="point" :tool="referenceToolRef">
        </referencePoint>
        -->
    </div>
</template>

<style scoped>

#canvas-container {
    position: absolute;
    left: 50%;
    width: fit-content;
    height: fit-content;
    transform: translateX(-50%);
    transform-origin: top;
    z-index: 5;
}

#canvas-container div{
    position: relative;
    width: 100%;
    height: 100%;
}

.canvasBW {
    position: absolute;
    pointer-events: none;
}

</style>