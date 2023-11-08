<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings';

import AutoForm from '@/components/ui/AutoForm.vue';
import {useToolsStore} from "@/stores/tools";
import {useColorStore} from "@/stores/color";
import {ref} from "vue";
import {useHistoryStore} from "@/stores/history";
import {useCamImageStore} from "@/stores/camimages";

const settingsStore = useSettingsStore()
const toolsStore = useToolsStore()
const colorStore = useColorStore()
const historyStore = useHistoryStore()
const camImageStore = useCamImageStore()

const group_name_input = ref()

function check_input(event: any) {
  if (event.key === 'Enter' && event.target.value !== '') {
    historyStore.add_selection_to_group(event.target.value)
    colorStore.drop_selection()
  } else if (event.key === 'Escape') {
    colorStore.drop_selection()
  } else if (event.key === 'Delete') {
    return
  }
  event.stopPropagation()
}

function transition_ended(_) {
  group_name_input.value.focus()
}

</script>

<template>
  <div class="position-absolute top-menu pe-none bg-body-tertiary rounded m-2 bg-opacity-75 border">
    <span>
      <span>
        <AutoForm v-model="settingsStore.captureVideo" :shown_in_group="false"></AutoForm>
      </span>
      <span v-if="settingsStore.captureVideo.value"><button class="btn btn-primary bi bi-camera"
                                                            @click="camImageStore.take_image()"></button></span>
      <span class="btn-group">
          <!-- TODO Add props inheritance to AutoForm (e.g. props="{btnColor: 'warning'}" being forwarded to ToggleButton) -->
          <AutoForm v-model="settingsStore.ui.hide_settings_column" :shown_in_group="false"></AutoForm>
          <AutoForm v-model="settingsStore.ui.split_mode" :shown_in_group="false"></AutoForm>
          <AutoForm v-model="settingsStore.ui.show_short_cuts" :shown_in_group="false"></AutoForm>
      </span>
      <span class="btn-group">
          <button v-for="(tool, _) in Object.values(toolsStore.tools)" class="btn"
                  :class="[tool.icon, (tool.state.active) ? 'btn-primary' : 'btn-outline-primary']"
                  @click="tool.activate()"></button>
      </span>
      <transition @after-enter="transition_ended">
        <span v-if="colorStore.selected_colors.length > 0" @mouseup.capture.stop>
          <input ref="group_name_input" class="pe-auto form-control" placeholder="GROUPNAME"
                 @mousedown.stop @mousemove.stop @keydown="check_input"
          >
        </span>
      </transition>
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
  display: inline-flex;
  pointer-events: all;
}

.top-menu span:not(:first-child) {
  margin-left: 10px;
}
</style>