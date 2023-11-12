<script setup lang="ts">
import {ref} from "vue";
import ToggleButton from "@/components/ui/ToggleButton.vue"
import KeyboardShortcut from "@/components/ui/KeyboardShortcut.vue"
import AboutModal from "@/components/modals/AboutModal.vue"

import {keyCombinations, useSettingsStore} from "@/stores/settings";

const expandedMenu = ref(false)

const settingsStore = useSettingsStore()

function sendAlert() {
  alert('About not added yet.')
}
</script>


<template>
  <ToggleButton v-model="expandedMenu" :filled-only="true" icon="bi-menu-app"></ToggleButton>
  <transition>
    <ul class="pe-auto dropdown-menu show top-100 mt-1" v-if="expandedMenu" @mouseleave="expandedMenu=false">
      <li><h6 class="dropdown-header">File</h6></li>
      <li><a class="dropdown-item" @click="keyCombinations.open_file.trigger()">Open Image <KeyboardShortcut :combination="keyCombinations.open_file"/></a></li>

      <li><h6 class="dropdown-header">Edit</h6></li>
      <li><a class="dropdown-item" @click="keyCombinations.undo.trigger()">Undo <KeyboardShortcut :combination="keyCombinations.undo"/></a></li>
      <li><a class="dropdown-item" @click="keyCombinations.forward.trigger()">Redo <KeyboardShortcut :combination="keyCombinations.forward"/></a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" @click="settingsStore.setModal(AboutModal)">About</a></li>
    </ul>
  </transition>
</template>

<style scoped>

ul {
  min-width: 300px;
  margin-left: 0 !important;
}
</style>