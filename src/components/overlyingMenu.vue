<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
import { toolManagementRef } from './Tool';

// UI elements
import toggleButton from '@/components/ui/toggleButton.vue'

defineProps(['captureCamera'])

const settingsStore = useSettingsStore()

</script>

<template>
    <div class="position-absolute m-2 pe-none floating-menu">
      <span><toggleButton v-model="settingsStore.captureVideo.value" :icons="['bi-camera-video', 'bi-camera-video-off']" :btnColor="'danger'"></toggleButton></span>
      <span v-if="settingsStore.captureVideo.value"><button class="btn btn-primary bi bi-camera" @click="captureCamera.takeImage()"></button></span>
      <span><toggleButton v-model="settingsStore.view_side_by_side.value" :icons="['bi-square-half', 'bi-front']" :btnColor="'warning'"></toggleButton></span>
      <span class="btn-group" role="group" aria-label="ToolToogles" v-if="!settingsStore.view_side_by_side">
        <!-- Toolgroup: TODO: Check if could be created with ui/toggleGroup -->
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
</style>