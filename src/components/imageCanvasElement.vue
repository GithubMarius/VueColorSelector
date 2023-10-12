<script setup lang="ts">
import { ref, watch, defineProps, Ref, onMounted, inject } from 'vue'
import colorCircleElement from './colorCircleElement.vue'
import referencePoint from './referencePoint.vue';
import referencePair from './referencePair.vue';
import referenceNWPoint from './referenceNWPoint.vue';
import { Color } from './color';
import { referenceTool } from './Tool'

const props = defineProps(['url', 'colorContainerElement', 'colors', 'settings'])

const canvasElement = ref(null)
const canvasContainerRef = ref(null)

const selection_tool_active = ref(false)

const image = ref(null)
const ctx = ref(null)

const tools: any =  inject('tools')
tools.value.tools.push(referenceTool)

const referenceToolRef = ref(referenceTool)

watch(
    () => props.url,
      (newUrl, _) => {
        showImage(newUrl)
     }, {
    immediate: true,
    deep: true,
 })

watch(
    () => props.settings.color_mode,
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

    // Set container width
    canvasContainerRef.value.style.width = image.value.width + 'px'
    canvasContainerRef.value.style.height = image.value.height + 'px'
}

function drawImage() {
    set_canvas_dimensions()
    if (props.settings.color_mode) {
        drawImageInColor()
    } else {
        drawImageInBw()
    }
    return true
}

function drawImageInColor() {
    ctx.value.drawImage(image.value, 0, 0);    
}

function drawImageInBw() {
    // Draw b/w image
    ctx.value.drawImage(image.value, 0, 0);
    ctx.value.fillStyle = '#FFF';
    ctx.value.fillRect(0, 0, image.value.width, image.value.height);
    ctx.value.globalCompositeOperation = 'luminosity';
    ctx.value.drawImage(image.value, 0, 0);
}


function add_color_element(event) {
    // If currently not using a selection tool
    // TODO: Check if timestamp could be removed
    if (!tools.value.active_tool && (tools.value.last_ts !== event.timeStamp)) {
        // Read color of pixel
        var xy = calculate_XY_position(event)
        var pixelData = get_pixel_color(xy[0], xy[1])

        // Create entry in colors array
        new Color(pixelData, xy[0], xy[1])
    } else {
        selection_tool_active.value = false
    }
}

function get_pixel_color(x, y) {
    // Get color at position (x, y)
    return ctx.value.getImageData(x, y, 1, 1).data;
}

function calculate_XY_position(event) {
    // Calculate xy position relative to canvas
    var canvasRect = canvasElement.value.getBoundingClientRect()
    var targetRect = event.target.getBoundingClientRect()
    
    return [targetRect.x - canvasRect.x + event.offsetX, targetRect.y - canvasRect.y + event.offsetY]
}


function arrayToRgbStr(arr) {
    // Converts array into rgba string
    return `rgba(${arr})`
}

onMounted(() => ctx.value = canvasElement.value.getContext('2d', { willReadFrequently: true }))
</script>

<template>
    <div ref="canvasContainerRef" class="container position-relative"
            :class="{dragging: referenceToolRef.update_call}"
            @contextmenu.prevent
            @click.left.exact="add_color_element"
        >
        <canvas id="canvas" ref="canvasElement">
        </canvas>
        <div>
        <colorCircleElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors" :settings="settings">
        </colorCircleElement>
        </div>
        <referencePair v-for="(pair, index) in referenceToolRef.pairs" :key="index" :pair="pair">
        </referencePair>
        <referenceNWPoint v-for="(point, index) in referenceToolRef.points" :key="index" :point="point" :tool="referenceToolRef">
        </referenceNWPoint>
    </div>
</template>

<style>
#canvas {
    position: absolute;
    left: 0px;
}


.dragging {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

</style>