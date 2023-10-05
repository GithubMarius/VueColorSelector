<script setup lang="ts">
import imageCanvasElement from './components/imageCanvasElement.vue'
import tabElement from './components/tabElement.vue'
import colorGroupElement from './components/colorGroupElement.vue'
import colorBlockElement from './components/colorBlockElement.vue'
import settingsElement from './components/settingsElement.vue'


import { ref, onMounted, computed, Ref, watch } from 'vue'
import { Color, ColorArray, ColorGroup } from './components/color'

// reactive state
const imageCanvasInstance = ref(null)
const colorContainerElement = ref(null)
const groupNameInputRef = ref(null)
const imgUrl = ref('src/assets/Fritz.jpg')
const colors = Color.colors
const tabs = ref({
  active_tab: 2,
  list: []
})

const settings = ref({
    background_color: <ColorArray>[0, 1, 2, 1],
    background_color_light: <ColorArray>[0, 1, 2, 1],
    color_mode: false
})

watch(() => colors.value, (value,_) => console.log(555),
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
  new Color([0.5, 1, 1, 1], 0, 0)
})

const groups = ref(ColorGroup.groups)
const numberSelectedEntries = computed(() => selectedEntries.value.length)

const selectedEntries = computed(() => {
  return colors.value.filter(color => color.selected)
})

function update_selection_groups(event) {
  if (event.target.value.length > 0) {
    selectedEntries.value.forEach(color => {
      color.group_name = event.target.value
      color.selected = false
    })
  }
}

</script>

<template>
  <button @click="settings.color_mode = !settings.color_mode"></button>
  <div class="row w-100 vh-100">
    <div id="canvas_column" class="col-sm-8 justify-content-center">
      <imageCanvasElement ref="imageCanvasInstance"
      :url="imgUrl"
      :colorContainerElement="colorContainerElement"
      :colors="colors"
      :settings="settings"></imageCanvasElement>
    </div>


    <div class="col-sm-4 bg-light">
      <Transition  @after-enter="groupNameInputRef.focus()">
        <div class="row bg-primary p-3 text-light" v-if="numberSelectedEntries > 0">
          <label class="form-label">Group name</label>
          <input ref="groupNameInputRef" class="form-control" type="text" @keyup.enter="update_selection_groups">
        </div>
      </Transition>
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
          <tabElement :tabs="tabs" :title="'Colors'">
            <colorBlockElement v-for="(color, index) in colors" :key="index" :color="color"></colorBlockElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'ColorsTest'">
            <colorGroupElement v-for="(group, index) in groups" :key="index" :group="group"></colorGroupElement>
          </tabElement>
          <tabElement :tabs="tabs" :title="'Settings'"><settingsElement></settingsElement></tabElement>
        </div>
      </div>
  </div>
</template>

<style>
:root {
  --col-pri: #0d6efd;
  --col-sec: #f8f9fa;
  --col-text-dark: #212529;
  --col-text-light: var(--col-sec);
}

.text-pri {
  color: var(--col-pri);
}

.text-light {
  color: var(--col-sec);
}

.bg-pri {
  background-color: var(--col-pri);
}

.bg-sec {
  background-color: var(--col-sec);
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