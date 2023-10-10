<script setup lang="ts">
import imageCanvasElement from './components/imageCanvasElement.vue'
import tabElement from './components/tabElement.vue'
import colorGroupElement from './components/colorGroupElement.vue'
import colorBlockElement from './components/colorBlockElement.vue'
import settingsElement from './components/settingsElement.vue'
import Settings from './components/settings'

import { ref, onMounted, Ref, watch, provide, computed } from 'vue'
import { Color, ColorGroup } from './components/color'
import { toolManagementRef } from './components/Tool'
import rectangularSelectionToolElement from './components/rectangularSelectionToolElement.vue'


// Refs state
const imageCanvasInstance = ref(null)
const colorContainerElement = ref(null)
const rectSelectionRef = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const colors = Color.colors
const tabs = ref({
  active_tab: 2,
  list: []
})
const settingsRef: Ref | Settings = ref(new Settings())


// Provides

provide('tools', toolManagementRef)
provide('settings', settingsRef)


watch(() => colors.value, (value,_) => true,
  { deep: true,
  immediate: true })

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
  new Color([0.5, 1, 1, 1],  80, 80)
})

const groups = ColorGroup.groups
/*
onMounted(() => {
  window.addEventListener('keyup', function(event) {
    console.log(event.key)
  })
})
*/

</script>

<template>
  <rectangularSelectionToolElement ref="rectSelectionRef">
  <div class="row w-100 vh-100 m-0">
    <div id="canvas_column" class="col-sm-8 justify-content-center bg-pri p-0">
      <imageCanvasElement ref="imageCanvasInstance"
      :url="imgUrl"
      :colorContainerElement="colorContainerElement"
      :colors="colors"
      :settings="settingsRef"></imageCanvasElement>
    </div>
    <div class="col-sm-4 bg-sec">
        <div class="mt-2">
          <div class="btn-group" role="group" aria-label="Basic example">
             <button v-for="(tool, index) in toolManagementRef.activatable_tools" :key="index" class="btn bi"
             :class="[tool.icon, tool.active ? 'btn-primary': 'btn-outline-primary']"
             @click="toolManagementRef.toggle_tool(index)"
             ></button>
          </div>
        </div>
        <div class="row mt-2">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button v-for="(tab, index) in tabs.list" :key="index"
            class="nav-link"
            :class="{active: (tabs.active_tab === index)}"
            @click="tab.activate">{{ tab.title }}</button>
          </div>
        </nav>
        </div>
        <div class="tab-content" id="nav-tabContent">
          <tabElement :tabs="tabs" :title="'File Dialog'"><input type="file" class="form-control"  @change="onFileChange"></tabElement>
          <tabElement :tabs="tabs" :title="'All colors'">
            <colorBlockElement v-for="(color, index) in colors" :key="index" :color="color"></colorBlockElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'Colors in groups'">
            <colorGroupElement v-for="(group, index) in groups" :key="index" :group="group"></colorGroupElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'Settings'"><settingsElement :settings="settingsRef"></settingsElement></tabElement>
        </div>
      </div>
  </div>
  </rectangularSelectionToolElement>
</template>

<style>
:root {
  --col-pri: #0d6efd;
  --col-sec: #f8f9fa;
  --col-text-dark: #212529;
  --col-text-light: var(--col-sec);
  --bg-default: #FFFFFF;
  --bg-secondary: var(--col-sec);
  --bg-attention: var(--col-pri);
  --text-default: #212529;
  --text-contrast: var(var(--col-text-light));
  --bs-body-color: var(--text-default);
}

body {
  color: var(--text-default);
}

.text-pri {
  color: var(--col-pri);
}

.text-default {
  color: var(--text-default);
}

.bg-pri{
  background-color: var(--bg-default);
}

.bg-sec {
  background-color: var(--bg-secondary);
}

.border-pri {
  border-color: var(--col-pri);
}

.btn-pri {
  color: var(--col-text-light);
  background-color: var(--col-pri);
  border-color: var(--col-pri);
}

.btn-pri:hover {
  color: var(--col-sec) !important;
  border-color: var(--col-pri) !important;
}

.btn-outline-pri {
  color: var(--col-pri) !important;
  background-color: var(--col-sec);
  border-color: var(--col-pri) !important;
}

.btn-outline-pri:hover {
  color: var(--col-text-light) !important;
  border-color: var(--col-pri) !important;
  background-color: var(--col-pri) !important;
}

.bg-attention {
  color: var(--col-text-light);
  background-color: var(--bg-attention);
}

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

.nav-link {
  color: var(--col-pri) !important;
}

.nav-link.active {
  color: var(--text-default) !important;
  border-bottom-color: transparent !important;
  background-color: var(--bg-secondary) !important;
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