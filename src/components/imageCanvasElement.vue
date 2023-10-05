<script setup lang="ts">
import { ref, watch, defineProps, Ref, onMounted } from 'vue'
import RectAngularSelectionElement from './RectAngularSelectionElement.vue';
import colorCircleElement from './colorCircleElement.vue'
import { Color } from './color';

const props = defineProps(['url', 'colorContainerElement', 'colors', 'settings'])

const canvasElement = ref(null)
const canvasContainerRef = ref(null)
const rectangularSelectionRef: Ref<typeof RectAngularSelectionElement> = ref(null)

const selection_start = ref([-1, -1])
const selection_end = ref([0, 0])
const selection_tool_active = ref(false)

const image = ref(null)
const ctx = ref(null)

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

function getSelectionNorm() {
    return [0, 1].map(x => (selection_start.value[x]-selection_end.value[x])**2).reduce((a, b) => a+b)
}

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
    if (!selection_tool_active.value) {
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

function drop_selection() {
    props.colors.forEach(color => color.selected = false)
}

function mouse_down(event){
    if (!event.shiftKey) {
        drop_selection()
    }


    selection_start.value = calculate_XY_position(event)
    selection_end.value = selection_start.value
}

function mouse_move(event){

    if (event.buttons === 1) {
        if (selection_start.value[0] === -1) {
            selection_start.value = calculate_XY_position(event)
        }

        selection_end.value = calculate_XY_position(event)
        if (!selection_tool_active.value && (getSelectionNorm() > 50)) {
            selection_tool_active.value = true
        }
    }
}

function mouse_up(_){
    rectangularSelectionRef.value.manifest_selection()
    selection_start.value = [-1,-1]
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

onMounted(() => ctx.value = canvasElement.value.getContext('2d', { willReadFrequently: true }))
</script>

<template>
    <div ref="canvasContainerRef" class="container position-relative"
            @mousedown.left="mouse_down"
            @mousedown.right="drop_selection"
            @contextmenu.prevent
            @click="add_color_element"
            @mouseup="mouse_up"
            @mousemove="mouse_move"
            @mouseleave="mouse_leave"
        >
        <canvas id="canvas" ref="canvasElement">
        </canvas>
        <div>
        <colorCircleElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors">
        </colorCircleElement>
        </div>
        <RectAngularSelectionElement ref="rectangularSelectionRef" :startSelection="selection_start" :endSelection="selection_end" :active="selection_tool_active" :colors="colors"></RectAngularSelectionElement>
    </div>
</template>

<style>
#canvas {
    position: absolute;
    left: 0px;
}

</style>