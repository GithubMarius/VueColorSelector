<script setup lang="ts">
import imageCanvasElement from './components/imageCanvasElement.vue'
import tabElement from './components/tabElement.vue'
import colorGroupElement from './components/colorGroupElement.vue'
import settingsElement from './components/settingsElement.vue'


import { ref, onMounted, computed, Ref } from 'vue'
import Color from './components/color'

// reactive state
const imageCanvasInstance = ref(null)
const colorContainerElement = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const colors = ref([new Color([0.5,1,1,1], 0, 0)])
const tabs = ref({
  active_tab: 0,
  list: []
})

// functions that mutate state and trigger updates


function onFileChange(event){
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = function (e) {

    //Set the Base64 string return from FileReader as source.
    (imgUrl as Ref).value = e.target.result;
  }
}

// lifecycle hooks
onMounted(() => {
})

const group_names = computed(() => Array.from(new Set(colors.value.map(color => color.group))))
const numberSelectedEntries = computed(() => selectedEntries.value.length)

const selectedEntries = computed(() => {
  return colors.value.filter(color => color.selected)
})

function update_selection_groups(event) {
  if (event.target.value.length > 0) {
    selectedEntries.value.forEach(color => color.group = event.target.value)
  }
  selectedEntries.value.forEach(color => console.log(color.group))
}

</script>

<template>
  <div class="row w-100 vh-100">
    <div class="col-sm-8 justify-content-center">
      <imageCanvasElement ref="imageCanvasInstance" :url="imgUrl" :colorContainerElement="colorContainerElement" :colors="colors"></imageCanvasElement>
    </div>


    <div class="col-sm-4 bg-light">
      <Transition>
        <div class="row bg-primary p-3 text-light" v-if="numberSelectedEntries > 0">
          <label class="form-label">Group name</label>
          <input class="form-control" type="text" @keyup.enter="update_selection_groups">
        </div>
      </Transition>
        <div class="row mt-2">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button v-for="(tab, index) in tabs.list" :key="index"
            class="nav-link"
            :class="{active: (tabs.active_tab === index)}"
            @click="tabs.active_tab=index">{{ tab.title }}</button>
          </div>
        </nav>
        </div>
        <div class="tab-content" id="nav-tabContent">
          <tabElement :tabs="tabs" :title="'File Dialog'"><input type="file" class="btn btn-primary"  @change="onFileChange"></tabElement>
          <tabElement :tabs="tabs" :title="'Colors'">
            <colorGroupElement :colors="colors" :group_name="'All'" :show_all="true"></colorGroupElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'ColorsTest'">
            <colorGroupElement v-for="(group_name, index) in group_names" :key="index" :group_name="group_name" :colors="colors"></colorGroupElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'Settings'"><settingsElement></settingsElement></tabElement>
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


/* from https://vuejs.org/guide/built-ins/transition.html#the-transition-component */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>