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

function getSelectionNorm() {
    return [0, 1].map(x => (selection_start.value[x]-selection_end.value[x])**2).reduce((a, b) => a+b)
}

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
        var xy = calculate_XY_position(event)
        var pixelData = canvasElement.value.getContext('2d', { willReadFrequently: true }).getImageData(xy[0], xy[1], 1, 1).data;

        // Create entry in colors array
        props.colors[props.colors.length] = {color: pixelData, xPos: xy[0], yPos: xy[1], rgba: arrayToRgbStr(pixelData), hovered: false, selected: false}
    } else {
        selection_tool_active.value = false
    }
}

function calculate_XY_position(event) {
    var canvasRect = canvasElement.value.getBoundingClientRect()
    var targetRect = event.target.getBoundingClientRect()
    
    return [targetRect.x - canvasRect.x + event.offsetX, targetRect.y - canvasRect.y + event.offsetY]
}

function mouse_down(event){
    selection_start.value = calculate_XY_position(event)
    selection_end.value = selection_start.value
}

function mouse_move(event){

    if (event.buttons === 1) {
        
        selection_end.value = calculate_XY_position(event)
        if (!selection_tool_active.value && (getSelectionNorm() > 50)) {
            selection_tool_active.value = true
        }
    }
}

function mouse_up(_){
        selection_start.value = [0, 0]
        selection_end.value = [0, 0]
}

function mouse_leave(event){
    mouse_up(event)
    selection_tool_active.value = false
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
            @mousemove="mouse_move"
            @mouseleave="mouse_leave">
        <canvas id="canvas" ref="canvasElement">
        </canvas>
        <div>
        <colorCircleElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors">
        </colorCircleElement>
        </div>
        <RectAngularSelectionElement :startSelection="selection_start" :endSelection="selection_end" :active="selection_tool_active" :colors="colors"></RectAngularSelectionElement>
    </div>
</template>

<style>
#canvas {
    position: absolute;
    left: 0px;
}
</style>