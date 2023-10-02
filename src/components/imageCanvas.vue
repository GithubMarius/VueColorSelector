<script setup>
import { ref, watch, defineProps } from 'vue'
import RectAngularSelectionElement from './RectAngularSelectionElement.vue';
import colorCircleElement from './colorCircleElement.vue'

const props = defineProps(['url', 'colorContainerElement', 'colors'])

const canvasElement = ref(null)
const canvasContainerRef = ref(null)

const selection_start = ref([0,0])
const selection_end = ref([0,0])
const selection_tool_active = ref(false)

watch(
    () => props.url,
      (newUrl, _) => {
        console.log(newUrl)
        showImage(newUrl)
     }, {
    immediate: true,
    deep: true,
 })

function showImage(url) {
    var image = new Image()

    //Set the Base64 string return from FileReader as source.
    image.src =url

    //Validate the File Height and Width.
    image.onload = function () {
    canvasElement.value.width = this.width
    canvasElement.value.height = this.height
    canvasElement.value.getContext('2d').drawImage(this, 0, 0);
    return true;
    };
}


function add_color_element(event) {
    // If currently not using a selection tool
    if (!selection_tool_active.value) {
        // Read color of pixel
        var pixelData = canvasElement.value.getContext('2d', { willReadFrequently: true }).getImageData(event.offsetX, event.offsetY, 1, 1).data;

        // Create entry in colors array
        props.colors[props.colors.length] = {color: pixelData, xPos: event.offsetX, yPos: event.offsetY, rgba: arrayToRgbStr(pixelData), hovered: false}
    } else {
        selection_tool_active.value = false
    }
}

function mouse_down(event){
    selection_start.value = [event.offsetX, event.offsetY]
}

function mouse_move(event){
    selection_tool_active.value = true
    if (event.buttons === 1) {
        if (event.target !== canvasElement.value) {
            var offset = [0,0]
            if (window.getComputedStyle(event.target).getPropertyValue('transform') !== 'none') {
                const res = window.getComputedStyle(event.target).getPropertyValue('transform')
                offset = res.slice(0,-1).split(',').slice(4).map(x => Number(x))
            }
            selection_end.value = [event.offsetX + event.target.offsetLeft + offset[0], event.offsetY + event.target.offsetTop + offset[1]]
        }
        else {
            selection_end.value = [event.offsetX, event.offsetY]
        }
    }
}

function mouse_up(event){
}

function arrayToRgbStr(arr) {
    // Converts array into rgba string
    return `rgba(${arr})`
}
</script>

<template>
    <div ref="canvasContainerRef"
            @mousedown="mouse_down"
            @click="add_color_element"
            @mouseup="mouse_up"
            @mousemove="mouse_move">
        <canvas id="canvas" ref="canvasElement">
        </canvas>
        <div>
        <colorCircleElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors">
        </colorCircleElement>
        </div>
        <RectAngularSelectionElement :startSelection="selection_start" :endSelection="selection_end"></RectAngularSelectionElement>
    </div>
</template>

<style>
#canvas {
    position: absolute;
    left: 0px;
}
</style>