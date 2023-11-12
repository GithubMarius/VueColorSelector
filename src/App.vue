<script setup lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue
import {markRaw, onMounted, onUnmounted, ref, toRaw, watch} from 'vue'

// Stores
import {useGroupStore} from '@/stores/color'
import {useHistoryStore} from '@/stores/history'
import {useSettingsStore} from '@/stores/settings'
import {useToolsStore} from "@/stores/tools"

// Columns
import ContentColumn from './components/columns/ContentColumn.vue'
import SettingsColumn from '@/components/columns/SettingsColumn.vue'

// Other components
import OverlyingMenu from '@/components/OverlyingMenu.vue'
import RectangularSelectionTool from '@/components/RectangularSelection.vue'

// Utils
import {openDataImportFileDialog, openImgFileDialog, return_download_file} from '@/utils/fileManagement'
import {KeyCombinationWithInfo} from './utils/keyboardinput'
import Toasts from "@/components/Toasts.vue"

// Modals
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal.vue"

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
settingsStore.keyCombinations.toggle_theme.bind((event: KeyboardEvent) => {
  settingsStore.ui.light.toggle()
  event.preventDefault()
})

// Toggle group visibility
settingsStore.keyCombinations.toggle_color_group.bind((event: KeyboardEvent) => {
  groupStore.toggle_group_visibility_by_index(Number(event.key) - 1)
  event.preventDefault()
})

// Open image
settingsStore.keyCombinations.open_file.bind((event) => {
  openImgFileDialog()
  event.preventDefault()
})

// Import points (and captured images)
settingsStore.keyCombinations.import.bind((event: KeyboardEvent) => {
  openDataImportFileDialog()
  event.preventDefault()
})

// Export points (and captured images)
settingsStore.keyCombinations.export.bind((event: KeyboardEvent) => {
  return_download_file()
  event.preventDefault()
})

// Show keyboard shortcuts
settingsStore.keyCombinations.show_keyboard_shortcuts.bind((event: KeyboardEvent) => {
  settingsStore.setModal(KeyboardShortcutsModal)
  event.preventDefault()
})

// Toggle Camera
settingsStore.keyCombinations.toggle_cam.bind(() => {
  settingsStore.captureVideo.toggle()
})

// Toggle Color Mode
settingsStore.keyCombinations.toggle_color_mode.bind(() => {
  settingsStore.color_mode.toggle()
})

// Toggle Preview Mode
settingsStore.keyCombinations.toggle_preview.bind((event: KeyboardEvent) => {
  settingsStore.ui.hide_settings_column.toggle()
  event.preventDefault()
})

// Toggle Split Mode
settingsStore.keyCombinations.toggle_split_mode.bind(() => {
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
  KeyCombinationWithInfo.check_bound_combinations(event)
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
    </div>
    <!-- Toasts (popups with temporarily displayed information) -->
    <Toasts></Toasts>
  </RectangularSelectionTool>
  <!-- Modal -->
  <component :is="toRaw(settingsStore.modal)" v-model:visible="settingsStore.ui.modalVisible"
             v-if="toRaw(settingsStore.modal) && settingsStore.ui.modalVisible"></component>
</template>

<style lang="scss">
@import "./styles/scss/_styles.scss";

:root {
  --color-highlighted: rgb(14, 137, 231);
}
.pipetteCursor {
  cursor: url(src/assets/icons/eyedropper.svg) 0 16, pointer;
}


.column-container {
  max-height: 100vh;
}

.column-container > div {
  min-height: 100% !important;
  overflow: auto;
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