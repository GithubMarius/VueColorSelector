<script setup lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'

// Stores
import { useGroupStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history'
import { KeyCombination, useSettingsStore } from '@/stores/settings'

// Tabs
import GroupedColorsTab from '@/components/tabs/GroupedColorsTab.vue'
import HistoryTab from '@/components/tabs/HistoryTab.vue'
import ImportExportTab from '@/components/tabs/ImportExportTab.vue'
import ReferenceTab from '@/components/tabs/ReferencesTab.vue'
import SettingsTab from '@/components/tabs/SettingsTab.vue'
import CapturedImagesTab from './components/tabs/CapturedImagesTab.vue'

// Other components
import CaptureCamera from '@/components/CaptureCamera.vue'
import ImageCanvas from '@/components/ImageCanvas.vue'
import CapturedImage from '@/components/CapturedImage.vue'
import ColorViewer from '@/components/ColorViewer.vue'
import OverlyingMenu from '@/components/OverlyingMenu.vue'
import RectangularSelectionTool from '@/components/RectangularSelectionTool.vue'

// Utils
import { toolManagementRef } from '@/utils/Tools'
import { openDataImportFileDialog, return_download_file } from '@/utils/fileManagement'

// Refs
const ImageCanvasInstance = ref(null)
const rectSelectionRef = ref(null)
const captureCameraRef = ref()

// Provides
provide('tools', toolManagementRef)

// Use stores
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()
const groupStore = useGroupStore()

// Create tabs object
const tabs = {
  active_tab: ref(0),
  tab_buttons: ref(0),
  list:
    {
      'Captured Images': CapturedImagesTab,
      'Colors': GroupedColorsTab,
      'References': ReferenceTab,
      'Settings': SettingsTab,
      'Import/Export': ImportExportTab,
      'History': HistoryTab,
  },
  open_tab(index: number) {
    if ([...this.tab_buttons.value.keys()].includes(index)) {
      this.active_tab.value = index
    }
  }
}

// Watch for theme change
watch(() => settingsStore.ui.light.value, () => {
  document.documentElement.setAttribute('data-bs-theme', settingsStore.theme)
})

// Key Bindings

// Forward/Undo history
settingsStore.keycombinations.undo.bind(historyStore.undo)
settingsStore.keycombinations.forward.bind(historyStore.forward)

// Toggle theme
settingsStore.keycombinations.toggle_theme.bind((event) => {
  settingsStore.ui.light.toggle()
  event.preventDefault()
})

// Toggle group visibility
settingsStore.keycombinations.toggle_color_group.bind((event) => {
  groupStore.toggle_group_visibility_by_index(Number(event.key)-1)
  event.preventDefault()
})

// Go to tab
settingsStore.keycombinations.open_tab.bind((event) => {
  tabs.open_tab(Number(event.key)-1)
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
  settingsStore.captureVideo.toggle()
})

// Toggle Color Mode
settingsStore.keycombinations.toggle_color_mode.bind((_) => {
  settingsStore.color_mode.toggle()
})

// Toggle Preview Mode
settingsStore.keycombinations.toggle_preview.bind((event) => {
  settingsStore.ui.hide_settings_column.toggle()
  event.preventDefault()
})

// Change image opacity
settingsStore.keycombinations.change_image_opacity.bind((event) => {
  if (event.key === '+') {
    settingsStore.ui.opacity.value = Math.min(settingsStore.ui.opacity.value + 0.1, 1)
  } else {
    settingsStore.ui.opacity.value = Math.max(settingsStore.ui.opacity.value - 0.1, 0)
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

// Remove key listener again
onUnmounted(() => {
  document.removeEventListener('keydown', key_listener)
})
</script>

<template>
  <RectangularSelectionTool ref="rectSelectionRef">
    <div class="row w-100 vh-100 m-0 overflow-hidden p-0">
      <div id="canvasColumn" class="col-sm p-0 position-relative overflow-auto">
        <!-- Image canvas -->
        <ImageCanvas ref="ImageCanvasInstance"></ImageCanvas>
      </div>
      <div id="split-column" class="col-sm p-0 position-relative overflow-auto mh-100" :class="[settingsStore.ui.split_mode.value ? 'col-sm' : 'd-none']">
        <!-- captured image -->
        <CapturedImage></CapturedImage>
        <!-- video capture-->
        <CaptureCamera ref="captureCameraRef"></CaptureCamera>
      </div>
      <div id="settings-column" class="col-sm-4 p-0 mh-100 mw-20 bg-body-tertiary" :class="[!settingsStore.ui.hide_settings_column.value? 'col-sm-4' : 'd-none']">
        <div class="row">
          <!-- Colorviewer -->
          <ColorViewer>
          </ColorViewer>
        </div>
        <div class="row mt-4">
          <!-- Tab-Selection -->
          <nav>
            <div class="nav nav-pills px-2" id="nav-tab" role="tablist">
              <button :ref="tabs.tab_buttons" v-for="(tab, index) in Object.keys(tabs.list)" :key="index"
              class="nav-link"
              :class="{active: tabs.active_tab.value === index}"
              @click="tabs.active_tab.value = index">{{ tab }}</button>
            </div>
          </nav>
        </div>
        <div class="row m-2 p-2 tab-content" id="nav-tabContent">
          <!-- Tabs -->
          <component :is="Object.values(tabs.list)[tabs.active_tab.value]"></component>
        </div>
      </div>
      <!-- overlying menu -->
      <OverlyingMenu :CaptureCamera="captureCameraRef"></OverlyingMenu>
    </div>
  </RectangularSelectionTool>
</template>

<style lang="scss">
 @import "./styles/scss/_styles.scss";

:root {
    --color-highlighted: rgb(14, 137, 231);
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
  height: fit-content;
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