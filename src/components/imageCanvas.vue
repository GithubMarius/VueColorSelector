<script setup>
import { ref, watch, defineExpose, defineProps, watchEffect } from 'vue'

const props = defineProps(['url', 'colorContainerElement'])
const canvasElement = ref(null)

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

    //Read color of pixel
    var pixelData = canvasElement.value.getContext('2d', { willReadFrequently: true }).getImageData(event.offsetX, event.offsetY, 1, 1).data;

    //Create div in color container
    var ele = document.createElement('div')
    ele.classList.add('color_block')
    console.log(pixelData)
    ele.style.backgroundColor=`rgba(${pixelData})`
    props.colorContainerElement.appendChild(ele)
}
</script>

<template>
    <canvas id="canvas" ref="canvasElement" @click="add_color_element"></canvas>
</template>