<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";

// Vue
import { ref, Ref, provide, onMounted, onUnmounted, watch } from 'vue'

// Stores
import { KeyCombination, useSettingsStore } from '@/stores/settings'
import { useHistoryStore } from '@/stores/history'
import { useGroupStore } from '@/stores/color'

// UI elements
import toggleButton from '@/components/ui/toggleButton.vue'

// Tabs
import settingsTab from '@/components/tabs/settingsTab.vue'
import allColorsTab from '@/components/tabs/allColorsTab.vue'
import groupedColorsTab from '@/components/tabs/groupedColorsTab.vue'
import importExportTab from "@/components/tabs/importExportTab.vue";
import referenceTab from '@/components/tabs/referencesTab.vue'
import HistoryTab from "@/components/tabs/historyTab.vue";

import { toolManagementRef } from '@/components/Tool'

import imageCanvas from '@/components/imageCanvas.vue'
import colorViewer from '@/components/colorViewer.vue'
import rectangularSelectionToolElement from '@/components/rectangularSelectionToolElement.vue'
import { openDataImportFileDialog, return_download_file } from "./utils/fileManagement";
import CaptureCamera from "./components/captureCamera.vue";

// Refs
const imageCanvasInstance = ref(null)
const colorContainerElement = ref(null)
const rectSelectionRef = ref(null)
const imgUrl: Ref<string> = ref('src/assets/Fritz.jpg')

// Provides
provide('tools', toolManagementRef)

// Use stores
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()
const groupStore = useGroupStore()

// Tabs
const all_tabs = {
  active_tab: ref(0),
  tab_buttons: ref(0),
  list:
    {
      'All Colors': allColorsTab,
      'Colors by Group': groupedColorsTab,
      'References': referenceTab,
      'Settings': settingsTab,
      'Import/Export': importExportTab,
      'History': HistoryTab,
  },
  open_tab(index: number) {
    if ([...this.tab_buttons.value.keys()].includes(index)) {
      this.active_tab.value = index
    }
  }
}

watch(() => settingsStore.bright, () => {
  document.documentElement.setAttribute('data-bs-theme', settingsStore.theme)
})

// Forward/Undo history
settingsStore.keycombinations.undo.bind(historyStore.undo)
settingsStore.keycombinations.forward.bind(historyStore.forward)

// Toggle theme
settingsStore.keycombinations.toggle_theme.bind(() => {
  settingsStore.bright = !settingsStore.bright
})

// Toggle group visibility
settingsStore.keycombinations.toggle_color_group.bind((event) => {
  groupStore.toggle_group_visibility_by_index(Number(event.key)-1)
  event.preventDefault()
})

// Go to tab
settingsStore.keycombinations.open_tab.bind((event) => {
  all_tabs.open_tab(Number(event.key)-1)
  event.preventDefault()
})

// Export points
settingsStore.keycombinations.export.bind((event) => {
  return_download_file()
  event.preventDefault()
})

// Import points
settingsStore.keycombinations.import.bind((event) => {
  openDataImportFileDialog()
  event.preventDefault()
})

// Toggle Camera
settingsStore.keycombinations.toggle_cam.bind((_) => {
  captureVideo.value = !captureVideo.value
})

// Toggle Color Mode
settingsStore.keycombinations.toggle_color_mode.bind((_) => {
  settingsStore.color_mode = !settingsStore.color_mode
})

// Change image opacity
settingsStore.keycombinations.change_image_opacity.bind((event) => {
  if (event.key === '+') {
    settingsStore.opacity.value = Math.min(settingsStore.opacity.value + 0.1, 1)
  } else {
    settingsStore.opacity.value = Math.max(settingsStore.opacity.value - 0.1, 0)
  }
  event.preventDefault()
})


// Keyboard shortcut listener
function key_listener (event: KeyboardEvent) {
  KeyCombination.check_bound_combinations(event)
}

// Add key listener and set theme attribute
onMounted(() => {
  document.addEventListener('keydown', key_listener)
  document.documentElement.setAttribute('data-bs-theme', settingsStore.theme)
})

const captureCamera = ref()
const captureVideo = ref(false)
// Remove key listener again
onUnmounted(() => {
  document.removeEventListener('keydown', key_listener)
})

</script>

<template>
  <rectangularSelectionToolElement ref="rectSelectionRef">
    <div class="row w-100 vh-100 m-0 overflow-hidden p-0">
        <div id="canvas-column" class="col-sm-8 justify-content-center p-0">
        <!-- video capture-->
        <CaptureCamera ref="captureCamera" v-model:captureVideo="captureVideo"></CaptureCamera>
        <!-- Image canvas -->
        <imageCanvas ref="imageCanvasInstance"
        :url="imgUrl"
        :colorContainerElement="colorContainerElement"></imageCanvas>
      </div>
      <div id="settings-column" class="col-sm-4 p-0 mh-100 mw-20">
        <div class="row">
          <!-- Colorviewer -->
          <colorViewer>
          </colorViewer>
        </div>
        <div class="row mt-4">
          <!-- Tab-Selection -->
          <nav>
            <div class="nav nav-pills px-2" id="nav-tab" role="tablist">
              <button :ref="all_tabs.tab_buttons" v-for="(tab, index) in Object.keys(all_tabs.list)" :key="index"
              class="nav-link"
              :class="{active: all_tabs.active_tab.value === index}"
              @click="all_tabs.active_tab.value = index">{{ tab }}</button>
            </div>
          </nav>
        </div>
        <div class="row m-2 p-2 tab-content" id="nav-tabContent">
          <!-- Tabs -->
          <component :is="Object.values(all_tabs.list)[all_tabs.active_tab.value]"></component>
        </div>
      </div>
      <!-- overlying menu -->
      <div class="position-absolute m-2 pe-none floating-menu">
        <span><toggleButton v-model="captureVideo" :icons="['bi-camera-video', 'bi-camera-video-off']" :btnColor="'danger'"></toggleButton></span>
        <span class="btn-group" role="group" aria-label="ToolToogles">
          <!-- Toolgroup: TODO: Check if could be created with ui/toggleGroup -->
          <button v-for="(tool, index) in toolManagementRef.activatable_tools" :key="index" class="btn bi"
          :class="[tool.icon, tool.active ? 'btn-primary': 'btn-outline-primary']"
          @click="toolManagementRef.toggle_tool(index)"
          ></button></span>
      </div>
    </div>
  </rectangularSelectionToolElement>
</template>

<style lang="scss">
 @import "./styles/scss/_styles.scss";

:root {
    --color-highlighted: rgb(14, 137, 231);
}

.floating-menu span{
  pointer-events: all;
}

.floating-menu span:not(:first-child) {
  margin-left: 10px;
}

.deleteCursor {
    cursor: url("src/assets/icons/dash-circle.svg") 12 12 , not-allowed !important;
}

.deleteCursor .deletable {
    cursor: url("src/assets/icons/dash-circle-fill.svg") 12 12 , not-allowed !important;
}

.content_container {
  max-height: 100%;
}

#canvas-column {
  position: relative;
  overflow: auto;
  height: 100vh;
}

#settings-column {
  overflow-y: auto;
  overflow-x: clip;
}

.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
}


.highlighted {
  border-color:  var(--color-highlighted) !important; 
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