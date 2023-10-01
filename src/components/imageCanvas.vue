<script>
import { ref } from 'vue'


const test_ref = ref(12311231)

function lol() {
    console.log(123)
}


function test(event) {

    var pixelData = canvasElement.value.getContext('2d', { willReadFrequently: true }).getImageData(event.offsetX, event.offsetY, 1, 1).data;

    var ele = document.createElement('div')
    ele.classList.add('test')
    console.log(pixelData)
    ele.style.backgroundColor=`rgba(${pixelData})`
    colorContainerElement.value.appendChild(ele)
}
console.log(123)

</script>

<template>
    {{scale}} <br><br>
    <canvas id="canvas" ref="canvasElement" @click="test"></canvas>
</template>