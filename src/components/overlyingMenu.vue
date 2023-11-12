<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings';

import AutoForm from '@/components/ui/AutoForm.vue';
import {useToolsStore} from "@/stores/tools";
import {useColorStore} from "@/stores/color";
import {ref, watch} from "vue";
import {useCamImageStore} from "@/stores/camimages";
import {AddSelectionToGroup} from "@/actions/coloractions";
import FileMenu from "@/components/FileMenu.vue";
import ToggleButton from "@/components/ui/ToggleButton.vue";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal.vue";

const settingsStore = useSettingsStore()
const toolsStore = useToolsStore()
const colorStore = useColorStore()
const camImageStore = useCamImageStore()

const group_name_input = ref()

function check_input(event: any) {
  if (event.key === 'Enter' && event.target.value !== '') {
    AddSelectionToGroup.create(event.target.value)
    colorStore.drop_selection()
  } else if (event.key === 'Escape') {
    colorStore.drop_selection()
  } else if (event.key === 'Delete') {
    return
  }
  event.stopPropagation()
}

function focus_input() {
  group_name_input.value?.focus()
}

watch(() => colorStore.selected_colors.length, focus_input)

</script>

<template>
  <div class="position-absolute top-menu pe-none">
      <span>
        <FileMenu/>
        <AutoForm v-model="settingsStore.captureVideo" :shown_in_group="false" :filled-only="true"></AutoForm>
        <span v-if="settingsStore.captureVideo.value">
          <button class="btn btn-primary bi bi-camera" @click="camImageStore.take_image()" />
        </span>
        <span class="autoform-group btn-group">
            <AutoForm v-model="settingsStore.ui.split_mode" :shown_in_group="false" :filled-only="true"></AutoForm>
            <AutoForm v-model="settingsStore.ui.hide_settings_column" :shown_in_group="false" :filled-only="true"></AutoForm>
            <AutoForm v-model="settingsStore.color_mode" :shown_in_group="false" :filled-only="true"></AutoForm>
            <ToggleButton :icons="['bi-keyboard', 'bi-keyboard']" @click="settingsStore.setModal(KeyboardShortcutsModal)" :filled-only="true" btn-color="secondary"/>

        </span>
        <span class="btn-group">
          <button v-for="(tool, _) in Object.values(toolsStore.tools)" class="btn"
                    :class="[tool.icon, (tool.state.active) ? 'btn-primary' : 'btn-outline-primary']"
                    @click="tool.activate()"></button>
        </span>
      </span>
      <transition @after-enter="focus_input">
        <span v-if="colorStore.selected_colors.length > 0">
          <input ref="group_name_input" class="pe-auto form-control" placeholder="GROUPNAME"
                 @mousedown.stop @mousemove.stop @keydown="check_input"
                 @mouseup.capture.stop>
        </span>
      </transition>

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

.top-menu > span {
  display: inline-flex;
}

.top-menu > span > * {
  pointer-events: all;
}

.top-menu > span > span > span {
  box-shadow: 0 0 5px 0 var(--bs-secondary);
}

.top-menu span:not(:first-child) {
  margin-left: 10px;
}

.top-menu > * {
  display: block;
  width: fit-content;
}
</style>

<style>
.top-menu > span > *:not(:first-child) {
  margin-left: 10px;
}

.autoform-group > label:nth-of-type(2) {
  transform: rotateY(180deg);
}
</style>