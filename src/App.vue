<script setup lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'

// Stores
import { useGroupStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'

// Columns
import ContentColumn from './components/columns/ContentColumn.vue'
import SettingsColumn from '@/components/columns/SettingsColumn.vue'

// Other components
import OverlyingMenu from '@/components/OverlyingMenu.vue'
import RectangularSelectionTool from '@/components/RectangularSelection.vue'

// Utils
import { openDataImportFileDialog, return_download_file } from '@/utils/fileManagement'
import { KeyCombination } from './utils/keyboardinput'

// Refs
const rectSelectionRef = ref(null)
const captureCameraRef = ref()

// Use stores
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()
const groupStore = useGroupStore()



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
    <div class="row column-container">
      <!-- Column with image and cam images -->
      <ContentColumn></ContentColumn>
      <!-- Settings column -->
      <SettingsColumn></SettingsColumn>
      <!-- Overlying menu -->
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

.column-container {
  padding: 0px;

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