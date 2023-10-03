<script setup>
import imageCanvas from './components/imageCanvas.vue';
import colorBlockElement from './components/colorBlockElement.vue'
import tabElement from './components/tabElement.vue'


import { ref, onMounted } from 'vue'
// reactive state
const imageCanvasInstance = ref(null)
const imageElement = ref(null)
const colorContainerElement = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const colors = ref([{color: [0.5,1,1,1], xPos: 0, yPos: 0, rgba: 'rgba(200,20,1,1)', hovered: false, selected: false}])
const tabs = ref({
  active_tab: 0,
  list: []
})

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
      <div class="col-sm-4 p-3">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button v-for="(tab, index) in tabs.list" :key="index"
            class="nav-link"
            :class="{active: (tabs.active_tab === index)}"
            @click="tabs.active_tab=index">{{ tab.title }}</button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <tabElement :tabs="tabs" :title="'File Dialog'"><input type="file" class="btn btn-primary"  @change="onFileChange"></tabElement>
          <tabElement :tabs="tabs" :title="'Colors'"><colorBlockElement v-for="(color, index) in colors" :key="index" :color="color" :colors="colors"></colorBlockElement></tabElement>
          <tabElement :tabs="tabs" :title="'Settings'">Test asdas adas</tabElement>
        </div>


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
  overflow: auto;
  height: 100vh;
}

.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
}
</style>