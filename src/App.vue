<script setup>
import imageCanvas from './components/imageCanvas.vue';

import { ref, onMounted } from 'vue'
// reactive state
const imageCanvasInstance = ref(null)
const canvas = document.createElement('canvas');
const count = ref(0)
const imageElement = ref(null)
const canvasElement = ref(null)
const colorContainerElement = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const scale = ref(0)

async function downloadImage() {
                    const blob = await (await fetch(this.imageUrl)).blob();
                    const url = URL.createObjectURL(blob);
                    Object.assign(document.createElement('a'), { href: url, download: 'image.jpg' })
                        .click();
                    URL.revokeObjectURL(url);
                }

// functions that mutate state and trigger updates


function onFileChange(){
  console.log(this)
  console.log(imageElement)
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {

    //Initiate the JavaScript Image object.
    var image = new Image();

    //Set the Base64 string return from FileReader as source.
    image.src = e.target.result;

    //Validate the File Height and Width.
    image.onload = function () {
      var height = this.height;
      var width = this.width;
      canvasElement.value.width = width
      canvasElement.value.height = height
      canvasElement.value.getContext('2d').drawImage(this, 0, 0);
      return true;
    };
    console.log(image)
  }
}

function test(event) {
  var canvas = imageCanvasInstance.value.$refs.canvasElement

  var pixelData = canvas.getContext('2d', { willReadFrequently: true }).getImageData(event.offsetX, event.offsetY, 1, 1).data;

  var ele = document.createElement('div')
  ele.classList.add('test')
  console.log(pixelData)
  ele.style.backgroundColor=`rgba(${pixelData})`
  colorContainerElement.value.appendChild(ele)
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)

  console.log(imageCanvasInstance)
  var canvas = imageCanvasInstance.value.$refs.canvasElement
  
  var image = new Image()

  //Set the Base64 string return from FileReader as source.
  image.src = imgUrl.value

  //Validate the File Height and Width.
  image.onload = function () {
    var height = this.height
    var width = this.width
    canvas.width = width
    canvas.height = height
    canvas-.getContext('2d').drawImage(this, 0, 0);
    return true;
  };
  console.log(image)
})
</script>

<template>
  <div class="container">

    <div class="row">
      <div id="canvas_column" class="col-sm-8 d-flex justify-content-center">
        <imageCanvas ref="imageCanvasInstance" :scale="scale"></imageCanvas>
        <canvas id="canvas" ref="canvasElement" @click="test"></canvas>
      </div>
      <div class="col-sm-4 ">
    <input type="file" class="btn btn-primary"  @change="onFileChange">
    <div ref="colorContainerElement">

    </div>
      </div>
    </div>
    
  </div>
</template>

<style>

#canvas_column {
  overflow: scroll;
  max-height: 100%;

}

.test {
  display: inline-block;
  width: 50px;
  height: 50px;
}
</style>