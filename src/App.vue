<script setup>
import imageCanvas from './components/imageCanvas.vue';
import colorBlockElement from './components/colorBlockElement.vue'


import { ref, onMounted } from 'vue'
// reactive state
const imageCanvasInstance = ref(null)
const imageElement = ref(null)
const colorContainerElement = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const colors= ref([{color: [0.5,1,1,1], xPos: 0, yPos: 0, rgba: 'rgba(200,20,1,1)', hovered: false}])

// functions that mutate state and trigger updates


function onFileChange(){
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {

    //Set the Base64 string return from FileReader as source.
    imgUrl.value = e.target.result;
  }
}

// lifecycle hooks
onMounted(() => {
})

</script>

<template>
  <div class="container">
    <div class="row">
      <div id="canvas_column" class="col-sm-8 d-flex justify-content-center ">
        <imageCanvas ref="imageCanvasInstance" :url="imgUrl" :colorContainerElement="colorContainerElement" :colors="colors"></imageCanvas>
      </div>
      <div class="col-sm-4 ">
        <input type="file" class="btn btn-primary"  @change="onFileChange">
        <div ref="colorContainerElement"></div>
        <colorBlockElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors"></colorBlockElement>
      </div>
    </div>
  </div>
</template>

<style>

.content_container {
  max-height: 100%;
}

#canvas_column {
  position: relative;
  overflow: scroll;
  height: 100vh;
}

.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
}
</style>