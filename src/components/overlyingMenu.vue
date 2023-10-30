<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { toolManagementRef } from '@/utils/Tools';

// UI elements
import ToggleButton from '@/components/ui/ToggleButton.vue'

defineProps(['CaptureCamera'])

const settingsStore = useSettingsStore()

</script>

<template>
    <div class="position-absolute m-2 pe-none floating-menu">
      <span><ToggleButton v-model="settingsStore.captureVideo.value" :icons="['bi-camera-video', 'bi-camera-video-off']" :btnColor="'danger'"></ToggleButton></span>
      <span v-if="settingsStore.captureVideo.value"><button class="btn btn-primary bi bi-camera" @click="CaptureCamera.takeImage()"></button></span>
      <span class="flip"><ToggleButton v-model="settingsStore.ui.hide_settings_column.value" :icons="['bi-window', 'bi-window-sidebar']" :btnColor="'warning'"></ToggleButton></span>
      <span class="btn-group" role="group" aria-label="ToolToogles" v-if="!settingsStore.ui.hide_settings_column.value">
        <!-- Toolgroup: TODO: Check if could be created with ui/ToggleGroup -->
        <button v-for="(tool, index) in toolManagementRef.activatable_tools" :key="index" class="btn bi"
        :class="[tool.icon, tool.active ? 'btn-primary': 'btn-outline-primary']"
        @click="toolManagementRef.toggle_tool(index)"
        ></button></span>
    </div>
</template>

<style scoped>
.floating-menu {
      z-index: 120;
}

.floating-menu span{
    pointer-events: all;
}

.floating-menu span:not(:first-child) {
    margin-left: 10px;
}

.flip {
    transform: rotateY(180deg);
}
</style>