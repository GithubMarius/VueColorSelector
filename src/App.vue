<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";

import imageCanvasElement from './components/imageCanvasElement.vue'
import settingsTab from './components/tabs/settingsTab.vue'
import Settings from './components/settings'

import allColorsTab from './components/tabs/allColorsTab.vue'
import groupedColorsTab from './components/tabs/groupedColorsTab.vue'

import { ref, onMounted, Ref, watch, provide, computed } from 'vue'
import { Color, ColorGroup } from './components/color'
import { toolManagementRef } from './components/Tool'
import rectangularSelectionToolElement from './components/rectangularSelectionToolElement.vue'

import referenceTab from './components/tabs/referencesTab.vue'


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

const all_tabs = {
  active_tab: ref(0),
  list:
  {
    'All Colors': allColorsTab,
    'Colors by Group': groupedColorsTab,
    'References': referenceTab,
    'Settings': settingsTab
}
}

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
    <div class="col-sm-4 p-0 bg-sec">
      <div class="row m-2">
          <input type="file" class="form-control" data-bs-theme="light"  @change="onFileChange">
        </div>
        <div class="row m-2">
          <div class="btn-group" role="group" aria-label="ToolToogles">
             <button v-for="(tool, index) in toolManagementRef.activatable_tools" :key="index" class="btn bi"
             :class="[tool.icon, tool.active ? 'btn-primary': 'btn-outline-primary']"
             @click="toolManagementRef.toggle_tool(index)"
             ></button>
          </div>
        </div>
        <div class="row">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <button v-for="(tab, index) in Object.keys(all_tabs.list)" :key="index"
              class="nav-link"
              :class="{active: all_tabs.active_tab.value === index}"
              @click="all_tabs.active_tab.value = index">{{ tab }}</button>
            </div>
          </nav>
        </div>
        <div class="row m-2 p-2 tab-content" id="nav-tabContent">
          <component :is="Object.values(all_tabs.list)[all_tabs.active_tab.value]" :colors="colors" :groups="groups" :settings="settingsRef"></component>
        </div>

      </div>
    </div>
  </rectangularSelectionToolElement>
</template>

<style>

:root {
  --col-pri: #0d6efd;
  --col-sec: #f8f9fa;
  --col-text-dark: #818a8f;
  --col-text-light: var(--col-sec);
  --bg-default: #FFFFFF;
  --bg-secondary: var(--col-sec);
  --bg-attention: var(--col-pri);
  --text-default: #212529;
  --text-contrast: var(var(--col-text-light));
  --bs-body-color: var(--text-default);
  --col-reference-org: var(--col-pri);
  --col-reference-scaled: #ff392b;
  --col-border-light:  #dee2e6;
  --REMOVEAGAIN:  #dee2e6;
}

body {
  color: var(--text-default);
}

.deleteCursor {
    cursor: url("src/assets/icons/dash-circle.svg") 12 12 , not-allowed !important;
}

.deleteCursor .deletable {
    cursor: url("src/assets/icons/dash-circle-fill.svg") 12 12 , not-allowed !important;
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

.border-light {
  border-color: var(--col-border-light) !important;
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
  background-color: transparent;
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

.nav-tabs {
  border-color : var(--col-border-light);
}

.nav-link.active {
  color: var(--text-default) !important;
  border-color: var(--col-border-light) !important;
  border-bottom-color: transparent !important;
  background-color: var(--bg-secondary) !important;
}

.nav-link:hover {
  border-color: var(--col-border-light) !important;
  border-bottom-color: transparent !important;
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