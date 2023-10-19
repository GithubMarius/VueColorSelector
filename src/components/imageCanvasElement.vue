<script setup lang="ts">
import { defineProps, inject, onMounted, ref, watch } from 'vue';

import { useColorStore } from '@/stores/color';
import { useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import { referenceTool } from '@/components/Tool';
import colorCircleElement from '@/components/elements/colorCircleElement.vue';
import referencePair from '@/components/elements/referencePairElement.vue';
import referencePoint from '@/components/elements/referencePointElement.vue';

const props = defineProps(['url', 'colors'])

const canvasElement = ref(null)
const canvasElementBW = ref(null)
const canvasContainerRef = ref(null)

const selection_tool_active = ref(false)

const image = ref(null)
const ctx = ref(null)
const ctxBW = ref(null)

const tools: any =  inject('tools')
tools.value.tools.push(referenceTool)

const referenceToolRef = ref(referenceTool)

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
    () => settings.color_mode,
      (_value, _) => {
        drawImage()
     }
)

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

    // Set container width
    canvasContainerRef.value.style.width = image.value.width + 'px'
    canvasContainerRef.value.style.height = image.value.height + 'px'
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
    if (!tools.value.active_tool && (tools.value.last_ts !== event.timeStamp)) {
        const historyStore = useHistoryStore()
        historyStore.add_color(event)
    } else {
        selection_tool_active.value = false
    }
}

onMounted(() => {
    showImage(props.url)
    ctx.value = canvasElement.value.getContext('2d', { willReadFrequently: true })
    ctxBW.value = canvasElementBW.value.getContext('2d')
    })
</script>

<template>
    <div ref="canvasContainerRef" class="container position-relative"
            :class="{dragging: referenceToolRef.update_call}"
            @contextmenu.prevent
            @click.left.exact="add_color_element"
        >
        <canvas id="canvas" ref="canvasElement" class="canvas" :style="{opacity: settings.opacity}" :class="{'opacity-0': !settings.color_mode}" ></canvas>
        <canvas id="canvasBW" ref="canvasElementBW" class="canvas canvasBW" :style="{opacity: settings.opacity}" :class="{'d-none': settings.color_mode}"></canvas>
        <div>
            <referencePair v-for="(pair, index) in referenceToolRef.pairs" :key="index" :pair="pair" :tool="referenceToolRef">
            </referencePair>
            <colorCircleElement v-for="(color, index) in colorStore.colors" :key="index" :color="color">
            </colorCircleElement>
        </div>
        <referencePoint v-for="(point, index) in referenceToolRef.points" :key="index" :point="point" :tool="referenceToolRef">
        </referencePoint>
    </div>
</template>

<style>


.dragging {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

.canvas {
    position: absolute;
    left: 0px;
}

.canvasBW {
    pointer-events: none;
}

</style>