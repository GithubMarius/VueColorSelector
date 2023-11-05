<script setup lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue
import {onMounted, onUnmounted, ref, watch} from 'vue'

// Stores
import {useGroupStore} from '@/stores/color'
import {useHistoryStore} from '@/stores/history'
import {useSettingsStore} from '@/stores/settings'

// Columns
import ContentColumn from './components/columns/ContentColumn.vue'
import SettingsColumn from '@/components/columns/SettingsColumn.vue'

// Other components
import OverlyingMenu from '@/components/OverlyingMenu.vue'
import RectangularSelectionTool from '@/components/RectangularSelection.vue'

// Utils
import {openDataImportFileDialog, return_download_file} from '@/utils/fileManagement'
import {KeyCombination} from './utils/keyboardinput'
import Toasts from "@/components/Toasts.vue";
import {useToolsStore} from "@/stores/tools";

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
settingsStore.keyCombinations.undo.bind(historyStore.undo)
settingsStore.keyCombinations.forward.bind(historyStore.forward)

// Toggle theme
settingsStore.keyCombinations.toggle_theme.bind((event) => {
  settingsStore.ui.light.toggle()
  event.preventDefault()
})

// Toggle group visibility
settingsStore.keyCombinations.toggle_color_group.bind((event) => {
  groupStore.toggle_group_visibility_by_index(Number(event.key) - 1)
  event.preventDefault()
})


// Export points
settingsStore.keyCombinations.export.bind((event) => {
  return_download_file()
  event.preventDefault()
})

// Import points
settingsStore.keyCombinations.import.bind((event) => {
  openDataImportFileDialog()
  event.preventDefault()
})

// Toggle Camera
settingsStore.keyCombinations.toggle_cam.bind((_) => {
  settingsStore.captureVideo.toggle()
})

// Toggle Color Mode
settingsStore.keyCombinations.toggle_color_mode.bind((_) => {
  settingsStore.color_mode.toggle()
})

// Toggle Preview Mode
settingsStore.keyCombinations.toggle_preview.bind((event: KeyboardEvent) => {
  settingsStore.ui.hide_settings_column.toggle()
  event.preventDefault()
})

// Toggle Split Mode
settingsStore.keyCombinations.toggle_split_mode.bind((_) => {
  settingsStore.ui.split_mode.toggle()
})

// Change image opacity
settingsStore.keyCombinations.change_image_opacity.bind((event: KeyboardEvent) => {
  if (event.key === '+') {
    settingsStore.ui.opacity.value = Math.min(settingsStore.ui.opacity.value + 0.1, 1)
  } else {
    settingsStore.ui.opacity.value = Math.max(settingsStore.ui.opacity.value - 0.1, 0)
  }
  event.preventDefault()
})

// Keyboard shortcut listener
function key_listener(event: KeyboardEvent) {
  KeyCombination.check_bound_combinations(event)
}

// Add key listener and set theme attribute
onMounted(() => {
  document.addEventListener('keydown', key_listener)
  document.documentElement.setAttribute('data-bs-theme', settingsStore.theme)
  toolStore.tools.colorsTool.activate()
})

// Remove key listener again
onUnmounted(() => {
  document.removeEventListener('keydown', key_listener)
})

const toolStore = useToolsStore()
</script>

<template>
  <RectangularSelectionTool ref="rectSelectionRef" :class="{'user-select-none': toolStore.selectionTool.state.active}">
    <!-- Overlying menu -->
    <OverlyingMenu :CaptureCamera="captureCameraRef"></OverlyingMenu>
    <div class="row column-container">
      <!-- Column with image and cam images -->
      <ContentColumn></ContentColumn>
      <!-- Settings column -->
      <SettingsColumn></SettingsColumn>
      <!-- Toasts (popups with temporarily displayed information) -->
      <Toasts></Toasts>
    </div>
  </RectangularSelectionTool>
</template>

<style lang="scss">
@import "./styles/scss/_styles.scss";

:root {
  --color-highlighted: rgb(14, 137, 231);
}

.deleteCursor {
  cursor: url("src/assets/icons/dash-circle.svg") 12 12, not-allowed !important;
}

.deleteCursor .deletable {
  cursor: url("src/assets/icons/dash-circle-fill.svg") 12 12, not-allowed !important;
}

.content_container {
  max-height: 100%;
}

#canvas-column {
  position: relative;
  overflow: auto;
  height: fit-content;
}

.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
}


.highlighted {
  border-color: var(--color-highlighted) !important;
}

.column-container {
  padding: 0;
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