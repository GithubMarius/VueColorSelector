<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings';

import AutoForm from '@/components/ui/AutoForm.vue';
import {useToolsStore} from "@/stores/tools";

defineProps(['CaptureCamera'])

const settingsStore = useSettingsStore()
const toolsStore = useToolsStore()
</script>

<template>
  <div class="position-absolute top-menu pe-none bg-body-tertiary rounded m-2 bg-opacity-75 border">
      <span>
        <AutoForm v-model="settingsStore.captureVideo" :shown_in_group="false"></AutoForm>
      </span>
    <span v-if="settingsStore.captureVideo.value"><button class="btn btn-primary bi bi-camera"
                                                          @click="CaptureCamera.takeImage()"></button></span>
    <span class="flip">
        <!-- TODO Add props inheritance to AutoForm (e.g. props="{btnColor: 'warning'}" being forwarded to ToggleButton) -->
        <AutoForm v-model="settingsStore.ui.hide_settings_column" :shown_in_group="false"></AutoForm>
      </span>
    <span class="btn-group">
        <button v-for="(tool, _) in Object.values(toolsStore.tools)" class="btn"
                :class="[tool.icon, (tool.state.active) ? 'btn-primary' : 'btn-outline-primary']"
                @click="tool.activate()"></button>
      </span>

    <!-- TODO ADD NEW TOOL -->
    <!--       <span class="btn-group" role="group" aria-label="ToolToogles" v-if="!settingsStore.ui.hide_settings_column.value">
            Toolgroup: TODO: Check if could be created with ui/ToggleGroup
            <button v-for="(tool, index) in toolManagementRef.activatable_tools" :key="index" class="btn bi"
            :class="[tool.icon, tool.active ? 'btn-primary': 'btn-outline-primary']"
            @click="toolManagementRef.toggle_tool(index)"
            ></button></span> -->

  </div>
</template>

<style scoped>
.top-menu {
  padding: 10px;
  z-index: 120;
  width: fit-content;
}

.top-menu span {
  pointer-events: all;
}

.top-menu span:not(:first-child) {
  margin-left: 10px;
}

/* Fix flip */
.flip {
  transform: rotateY(180deg);
}
</style>